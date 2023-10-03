from .login import User, get_current_active_user, LOGIN_CREDENTIALS_COLLECTION
from fastapi import APIRouter, Depends
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1", tags=["update-api"])

class update_user(BaseModel):
    email: str | None = None
    full_name: str | None = None

@router.post("/users/me/update")
async def update_user_info(update_user: update_user, current_user: User = Depends(get_current_active_user)):
    LOGIN_CREDENTIALS_COLLECTION.find_one_and_update({"username": current_user.username}, { "$set": {"email": update_user.email, "full_name": update_user.full_name} })
    return {"detail": "ok"}