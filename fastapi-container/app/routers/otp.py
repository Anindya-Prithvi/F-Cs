import base64
import secrets
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from pyotp import TOTP

from ..utils.clients import OTP_SEED_COLLECTION
from ..utils.common_models import User
from .login import _get_user_seed, get_current_active_nokycuser, get_current_user

router = APIRouter(prefix="/api/v1/otp", tags=["otp-api"])


class OTP_formbody(BaseModel):
    value: int


# ONLY USE AT BUTTON CLICK... REFRESH COULD BREAK USER
@router.get("/add2FA")
def add_totp_authenticator(user: Annotated[User, Depends(get_current_user)]):
    seed = base64.b32encode(secrets.token_bytes(24)).decode()
    result = OTP_SEED_COLLECTION.update_one(
        {"username": user.username}, {"$setOnInsert": {"seed": seed}}, upsert=True
    )

    if result.matched_count == 1:
        raise HTTPException(418, "nuh uh")

    # WILL BE SAME UNLESS DELETED BY ADMIN
    authentic_string = TOTP(
        seed, digits=6, name=user.username, issuer="F CS"
    ).provisioning_uri()
    return {"url": authentic_string}


@router.get("/has2FA")
def user_has_2FA(user: Annotated[User, Depends(get_current_user)]):
    if _get_user_seed(user.username) is not None:
        return {"status": True}
    return {"status": False}


@router.get("/disable2FA")
def remove_users_2FA(user: Annotated[User, Depends(get_current_active_nokycuser)]):
    result = OTP_SEED_COLLECTION.delete_one({"username": user.username})
    if result.deleted_count == 1:
        return {"success": True}
    return {"success": False}


def verify_totp(otp: int, user: str):
    seed = _get_user_seed(user)
    if seed is not None:
        ov = TOTP(seed["seed"], digits=6).verify(otp)
        if not ov:
            raise HTTPException(400, detail="Invalid OTP")
    raise HTTPException(422, detail="Authenticator not configured.")
