from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException

from ..utils.clients import LOGIN_CREDENTIALS_COLLECTION
from .login import User, get_current_active_user

router = APIRouter(prefix="/api/v1", tags=["database-api"])


@router.get("/get_documents")
async def get_documents(
    user: Annotated[User, Depends(get_current_active_user)], locked: str = None
):
    global connection
    if locked != "OIEfjwgiojgiogjwio":
        raise HTTPException(status_code=403, detail="Not allowed")
    # Retrieve all documents from the MongoDB collection
    documents = list(LOGIN_CREDENTIALS_COLLECTION.find())
    for document in documents:
        document["_id"] = str(document["_id"])
    return {"documents": documents}


# @router.get("/get_")
# async def get_documents():
#     global connection
#     # Retrieve all documents from the MongoDB collection
#     documents = list(LOGIN_CREDENTIALS_COLLECTION.find())
#     for document in documents:
#         document["_id"] = str(document["_id"])
#     return {"documents": documents}
