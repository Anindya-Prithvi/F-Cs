from typing import Annotated

import requests
from fastapi import APIRouter, Depends, Form, HTTPException
from pydantic import BaseModel

from ..utils.clients import LOGIN_CREDENTIALS_COLLECTION
from ..utils.clients import USER_REPORT_COLLECTION

from .login import User, get_current_active_nokycuser, get_current_active_user

router = APIRouter(prefix="/api/v1", tags=["kyc-api"])

@router.post("/report_user")
def report_user(
    report_username: Annotated[str, Form()],
    report_reason: Annotated[str, Form()],
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    if current_user.username == report_username:
        raise HTTPException(status_code=403, detail="Can't report yourself")
    
    if LOGIN_CREDENTIALS_COLLECTION.find_one({"username": report_username}) is None:
        return {"status": "success", "message": "User reported"}
        
    if USER_REPORT_COLLECTION.find_one({"username": report_username, "reporter": current_user.username}) is not None:
        raise HTTPException(status_code=403, detail="User already reported")

    USER_REPORT_COLLECTION.insert_one(
        {
            "username": report_username,
            "reporter": current_user.username,
            "reason": report_reason,
        }
    )

    return {"status": "success", "message": "User reported"}


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
