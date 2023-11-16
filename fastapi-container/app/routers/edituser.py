from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.routers.otp import user_has_2FA, verify_totp
from app.sanitizers import email_sanitizer, full_name_sanitizer

from .login import (
    LOGIN_CREDENTIALS_COLLECTION,
    User,
    get_current_active_user,
    pwd_context,
    verify_password,
)

router = APIRouter(prefix="/api/v1", tags=["update-api"])


class UpdateUser(BaseModel):
    password: str  # mandatory
    email: str | None = None
    full_name: str | None = None
    new_password: str | None = None
    otp: int | None = None


@router.post("/users/me/update")
async def update_user_info(
    update_user: UpdateUser, current_user: User = Depends(get_current_active_user)
):
    if update_user.email is not None:
        email_sanitizer(update_user.email)

    if update_user.full_name is not None:
        full_name_sanitizer(update_user.full_name)

    if user_has_2FA(current_user)["status"]:
        if update_user.otp is None:
            raise HTTPException(422, "No OTP provided")
        verify_totp(update_user.otp, current_user.username)

    pwd_hash = pwd_context.hash(update_user.password)
    npwd_hash = None
    if update_user.new_password is not None:
        npwd_hash = pwd_context.hash(update_user.new_password)

    pwd_hash_of_user = LOGIN_CREDENTIALS_COLLECTION.find_one(
        {"username": current_user.username}, projection={"hashed_password"}
    )
    verified = verify_password(
        update_user.password, pwd_hash_of_user["hashed_password"]
    )

    if verified:
        rval = LOGIN_CREDENTIALS_COLLECTION.find_one_and_update(
            {
                "username": current_user.username,
                "hashed_password": pwd_hash_of_user["hashed_password"],
            },
            {
                "$set": {
                    "email": update_user.email or current_user.email,
                    "full_name": update_user.full_name or current_user.full_name,
                    "hashed_password": npwd_hash or pwd_hash,
                }
            },
        )
        print(rval)
    else:
        raise HTTPException(status_code=401, detail="Wrong Password")
    return {"detail": "ok"}
