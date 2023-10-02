from typing import Annotated

from fastapi import Depends, APIRouter

from app.routers.login import User
from app.routers.login import get_current_active_user, oauth2_scheme


router = APIRouter(prefix="/api/v1", tags=["document-verification-api"])


@router.post("/logout")
async def log_someone_out(current_user: Annotated[User, Depends(get_current_active_user)], token: Annotated[str, Depends(oauth2_scheme)]):
    pass



