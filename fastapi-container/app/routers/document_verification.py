from hashlib import sha256
from typing import Annotated

from bson.binary import Binary
from fastapi import APIRouter, Depends, HTTPException, UploadFile
from fastapi.responses import StreamingResponse

from app.routers.login import User, get_current_active_user

from ..utils.clients import PROPERTY_DOCUMENTS_COLLECTION

router = APIRouter(prefix="/api/v1", tags=["document-verification-api"])


# public key of user from user object
# TODO: limit upload filesize
# @router.post("/verify_file")
# async def verify_file(uploaded: UploadFile, user)

# FRONTEND:
# file -> hash + priv key -> sign
# BACKEND:
# derived_hash <- sign + public key
# file -> backend_hash
# backend_hash == derived_hash


def __verify_file_blob(file: UploadFile, signature: str, user: User):
    file_bin_encoded = Binary(file.file.read())
    file_hash = sha256(file_bin_encoded)
    fh_int = int.from_bytes(file_hash)
    pk_e, pk_n = int(user.public_key_e), int(user.public_key_n)

    if fh_int == pow(signature, pk_e, pk_n):
        return True

    return False


def __save_file_to_db(file: UploadFile, signature: str, user: User):
    file_bin_encoded = Binary(file.file.read())

    PROPERTY_DOCUMENTS_COLLECTION.insert_one(
        {
            "username": user.username,
            "encoded_file": file_bin_encoded,
            "signature": signature,
            "property_id": -1,
            "file_name": file.filename,
            "file_headers": file.headers,
            "file_type": file.content_type,
        }
    )


@router.post("/verify_upload_file/")
async def verify_upload_file(
    file: UploadFile,
    signature: str,
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    # file.
    # verify!

    if str.isnumeric(signature) is False:
        raise HTTPException(status_code=422, detail="signature not numeric")

    if __verify_file_blob(file=file, signature=signature, user=current_user) is False:
        raise HTTPException(status_code=400, detail="Signature did not match")

    __save_file_to_db(file=file, signature="ASDASD", user=current_user)

    return {"message": "ok"}


def iter_bytes(data, chunk_size=8192):
    start = 0
    while start < len(data):
        chunk = data[start : start + chunk_size]
        yield chunk
        start += chunk_size


@router.get("/download_file/")
async def download_file(
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    encoded_file = PROPERTY_DOCUMENTS_COLLECTION.find_one({})
    Binary(encoded_file["encoded_file"])

    return StreamingResponse(
        content=iter_bytes(encoded_file["encoded_file"]),
        media_type=encoded_file["file_headers"]["content-type"],
        headers={"filename": encoded_file["file_name"]},
    )
