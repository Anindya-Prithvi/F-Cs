from fastapi import FastAPI, Request, APIRouter
from pymongo import MongoClient
import time
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from fastapi.middleware.cors import CORSMiddleware
import os

router = APIRouter(prefix="/api/v1", tags=["database-api"])

mongo_client = None
mongo_host = "mongodb"  # This is the service name from docker-compose.yml
mongo_port = 27017
mongo_user = "admin"
mongo_password = "admin"

# Create a MongoDB client
client = MongoClient(
    host=mongo_host, 
    port=mongo_port, 
    username=mongo_user, 
    password=mongo_password, 
    tls=True,
    tlsAllowInvalidCertificates=True
)

db = client["bob"]
collection = db["test"]
print(db)
print(db.list_collection_names())


@router.post("/create_document")
async def create_document():
    # Create a new document in the MongoDB collection
    global connection
    document = {"name": "John", "age": 30}
    result = collection.insert_one(document)
    return {"message": "Document created", "document_id": str(result.inserted_id)}


@router.get("/get_documents")
async def get_documents():
    global connection
    # Retrieve all documents from the MongoDB collection
    documents = list(collection.find())
    for document in documents:
        document["_id"] = str(document["_id"])
    return {"documents": documents}
