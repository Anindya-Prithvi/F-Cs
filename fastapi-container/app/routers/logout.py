from typing import Annotated

from fastapi import APIRouter, Depends
from jose import jwt

from app.routers.login import (
    ALGORITHM,
    SECRET_KEY,
    User,
    get_current_active_user,
    oauth2_scheme,
)
from app.utils.clients import JWT_REVOCATION_COLLECTION

router = APIRouter(prefix="/api/v1", tags=["logout-api"])


@router.get("/logout")
async def log_someone_out(
    current_user: Annotated[User, Depends(get_current_active_user)],
    token: Annotated[str, Depends(oauth2_scheme)],
):
    curr_payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    upd_rec = JWT_REVOCATION_COLLECTION.find_one_and_update(
        {"username": current_user.username},
        {"$set": {"revok_t": curr_payload.get("exp")}},
    )
    if upd_rec is None:
        JWT_REVOCATION_COLLECTION.insert_one(
            {"username": current_user.username, "revok_t": curr_payload.get("exp")}
        )
    return {"status": "ok"}
