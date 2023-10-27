from fastapi import APIRouter, Depends, HTTPException
from ..utils.clients import LOGIN_CREDENTIALS_COLLECTION
from typing import Annotated
from .login import User, get_current_active_nokycuser, get_current_user
import requests
from pydantic import BaseModel


class KycDetails(BaseModel):
	kyc_email: str
	kyc_password: str




router = APIRouter(prefix="/api/v1", tags=["kyc-api"])



@router.post("/kyc")
def kyc(kyc_detail: KycDetails, current_user: Annotated[User, Depends(get_current_active_nokycuser)]):
	if current_user.is_kyc == True:
		raise HTTPException(status_code=403, detail="Can't re-register kyc")
	
	URL = "https://192.168.3.39:5000/kyc"
	body_obj = {
		"email": kyc_detail.kyc_email,
		"password": kyc_detail.kyc_password
	}

	response = requests.post(url=URL, json=body_obj, verify=False)

	if response.json()["status"] == "success":
		rval = LOGIN_CREDENTIALS_COLLECTION.find_one_and_update(
			{"username": current_user.username},
			{"$set": {"is_kyc": True, "kyc_email": kyc_detail.kyc_email}},
		)

		return {
			"status": "success",
			"message": "KYC Successful"
		}

	else: 

		return {
			"status": "error",
			"message": "KYC Failed"
		}

	


