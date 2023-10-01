from fastapi import FastAPI, Request, APIRouter
import time
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from fastapi.middleware.cors import CORSMiddleware
import os

from ..utils.clients import LOGIN_CREDENTIALS_COLLECTIONS
from .login import oauth2_scheme

from typing import Annotated
from fastapi import Depends


router = APIRouter(prefix="/api/v1", tags=["database-api"])


@router.post("/create_document")
async def create_document():
    # Create a new document in the MongoDB collection
    global connection

    documents = [{
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "disabled": False,
    },
    {
        "username": "alice",
        "full_name": "Alice Chains",
        "email": "alicechains@example.com",
        "hashed_password": "$2b$12$gSvqqUPvlXP2tfVFaWK1Be7DlH.PKZbv5H8KnzzVgXXbVxpva.pFm",
        "disabled": True,
    }]

    result = LOGIN_CREDENTIALS_COLLECTIONS.insert_many(documents)
    return {"message": "Document created", "document_id": str(result)}


@router.get("/get_documents")
async def get_documents(token: Annotated[str, Depends(oauth2_scheme)]):
    global connection
    # Retrieve all documents from the MongoDB collection
    documents = list(LOGIN_CREDENTIALS_COLLECTIONS.find())
    for document in documents:
        document["_id"] = str(document["_id"])
    return {"documents": documents}

@router.get("/get_")
async def get_documents():
    global connection
    # Retrieve all documents from the MongoDB collection
    documents = list(LOGIN_CREDENTIALS_COLLECTIONS.find())
    for document in documents:
        document["_id"] = str(document["_id"])
    return {"documents": documents}