import os
from datetime import datetime, timedelta
from typing import Annotated

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, Form, HTTPException, Security, status
from fastapi.security import (
    OAuth2PasswordBearer,
    OAuth2PasswordRequestForm,
    SecurityScopes,
)
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, ValidationError
from pymongo.errors import DuplicateKeyError
from pyotp import TOTP

from ..sanitizers import *
from ..utils.clients import (
    JWT_REVOCATION_COLLECTION,
    LOGIN_CREDENTIALS_COLLECTION,
    OTP_SEED_COLLECTION,
)
from ..utils.common_models import User

load_dotenv()

# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))


class Token(BaseModel):
    access_token: str
    token_type: str
    need_otp: bool = False


class TokenData(BaseModel):
    username: str | None = None
    scopes: list[str] = []


class UserInDB(User):
    hashed_password: str


class NewUser(User):
    password: str


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/token",
    # scheme_name="Andy",
    scopes={"me": "Read information about the current user.", "items": "Read items."},
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
router = APIRouter(prefix="/api/v1", tags=["login-api"])


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def get_user(username: str):
    user_info = LOGIN_CREDENTIALS_COLLECTION.find_one({"username": username})

    if user_info is not None:
        return UserInDB(**user_info)

    return None


def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(
    security_scopes: SecurityScopes, token: Annotated[str, Depends(oauth2_scheme)]
):
    if security_scopes.scopes:
        authenticate_value = f'Bearer scope="{security_scopes.scope_str}"'
    else:
        authenticate_value = "Bearer"
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": authenticate_value},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        user_jwt_revoked = JWT_REVOCATION_COLLECTION.find_one(
            {"username": username, "revok_t": {"$gte": payload.get("exp")}}
        )
        if user_jwt_revoked is not None:
            raise credentials_exception
        token_scopes = payload.get("scopes", [])
        token_data = TokenData(scopes=token_scopes, username=username)
    except (JWTError, ValidationError):
        raise credentials_exception
    user = get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    for scope in security_scopes.scopes:
        if scope not in token_data.scopes:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not enough permissions",
                headers={"WWW-Authenticate": authenticate_value},
            )
    return user


async def get_current_active_nokycuser(
    current_user: Annotated[User, Depends(get_current_user)],
    token: Annotated[str, Depends(oauth2_scheme)],
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    if "no-otp" in jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM]).get("scopes"):
        raise HTTPException(status_code=400, detail="OTP not verified")
    return current_user


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_active_nokycuser)],
    token: Annotated[str, Depends(oauth2_scheme)],
):
    if not current_user.is_kyc:
        raise HTTPException(status_code=400, detail="KYC not verified")
    return current_user


def _get_user_seed(username: str):
    return OTP_SEED_COLLECTION.find_one({"username": username})


# USEFUL for testing, not really useful otherwise
def verify_totp(otp: int, user: str):
    seed = _get_user_seed(user)
    if seed is not None:
        ov = TOTP(seed["seed"], digits=6).verify(otp)
        return ov
    raise HTTPException(422, detail="Authenticator not configured.")


@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
):
    if not username_sanitize(form_data.username):
        raise HTTPException(500, "Sanity check failed")

    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    scope_access = []
    need_otp = False
    if _get_user_seed(user.username) is not None:
        # expect OTP
        scope_access.append("no-otp")
        need_otp = True

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "scopes": scope_access},
        expires_delta=access_token_expires,
    )
    return {"access_token": access_token, "token_type": "bearer", "need_otp": need_otp}


@router.post("/verifyloginotp")
async def verify_login_otp(
    otp: Annotated[int, Form()],
    current_user: Annotated[User, Depends(get_current_user)],
):
    verified = False
    response = {"verified": verified}
    if verify_totp(otp, current_user.username):
        response["verified"] = True

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": current_user.username, "scopes": []},
            expires_delta=access_token_expires,
        )

        response["newtoken"] = {"access_token": access_token, "token_type": "bearer"}

    return response


@router.get("/users/me/", response_model=User)
async def read_users_me(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user


@router.get("/users/me/items/")
async def read_own_items(
    current_user: Annotated[User, Security(get_current_active_user, scopes=["items"])]
):
    return [{"item_id": "Foo", "owner": current_user.username}]


@router.get("/status")
async def read_system_status(current_user: Annotated[User, Depends(get_current_user)]):
    return {"status": "ok"}


@router.post("/signup")
async def signup(user_details: NewUser):
    password = user_details.password
    user_details_dict = user_details.__dict__
    if not username_sanitize(user_details_dict["username"]):
        raise HTTPException(
            500, "Username should contain characters and numbers only and length < 25"
        )
    else:
        user_details_dict["username"] = sanitize(user_details_dict["username"])
    if not check_amenities(user_details_dict["full_name"]):
        raise HTTPException(500, "Full name should have only space separated words")
    else:
        user_details_dict["full_name"] = sanitize(user_details_dict["full_name"])
    del user_details_dict["password"]
    user_details_dict["hashed_password"] = pwd_context.hash(password)

    email_sanitizer(user_details_dict["email"])

    # if (
    #     str.isnumeric(user_details.public_key_e) is False
    #     or str.isnumeric(user_details.public_key_n) is False
    # ):
    #     raise HTTPException(status_code=422, detail="not numeric")

    try:
        LOGIN_CREDENTIALS_COLLECTION.insert_one(user_details_dict)
        return {"message": "Document created"}
    except DuplicateKeyError:
        return {"detail": "Already exists"}
    except Exception as e:
        print(e)
        return {"message": "Please report to admin"}
