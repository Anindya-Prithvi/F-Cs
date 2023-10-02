from typing import Annotated

import os
from fastapi import Depends, APIRouter

from app.routers.login import User
from app.routers.login import get_current_active_user, oauth2_scheme
from app.utils.clients import JWT_REVOCATION_COLLECTION

# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

router = APIRouter(prefix="/api/v1", tags=["logout-api"])
@router.post("/logout")
async def log_someone_out(current_user: Annotated[User, Depends(get_current_active_user)], token: Annotated[str, Depends(oauth2_scheme)]):
    # Also add jwt to revocation list
    upd_rec = JWT_REVOCATION_COLLECTION.find_one_and_update({"username": current_user.username}, {"$set":{"jwt":token[37:]}})
    if(upd_rec is None):
        JWT_REVOCATION_COLLECTION.insert_one({"username": current_user.username, "jwt":token[37:]})
    return {"status": "ok"}