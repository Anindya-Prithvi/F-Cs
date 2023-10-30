from typing import Annotated

import requests
from fastapi import APIRouter, Depends, Form, HTTPException
from pydantic import BaseModel

from ..utils.clients import LOGIN_CREDENTIALS_COLLECTION
from .login import User, get_current_active_nokycuser

router = APIRouter(prefix="/api/v1", tags=["kyc-api"])


@router.post("/kyc")
def kyc(
    kyc_email: Annotated[str, Form()],
    kyc_password: Annotated[str, Form()],
    current_user: Annotated[User, Depends(get_current_active_nokycuser)],
):
    if current_user.is_kyc is True:
        raise HTTPException(status_code=403, detail="Can't re-register kyc")

    URL = "https://192.168.3.39:5000/kyc"
    body_obj = {"email": kyc_email, "password": kyc_password}

    response = requests.post(url=URL, json=body_obj, verify=False)

    if response.json()["status"] == "success":
        LOGIN_CREDENTIALS_COLLECTION.find_one_and_update(
            {"username": current_user.username},
            {"$set": {"is_kyc": True, "kyc_email": kyc_email}},
        )

        return {"status": "success", "message": "KYC Successful"}

    else:
        return {"status": "error", "message": "KYC Failed"}
