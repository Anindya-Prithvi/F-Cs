from fastapi import FastAPI, Depends, Request
from app.routers.login import router as login_router
from pymongo import MongoClient
import time
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware

app = FastAPI()

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

app.add_middleware(HTTPSRedirectMiddleware)

mongo_client = None
app.include_router(login_router)

mongo_host = "mongodb"  # This is the service name from docker-compose.yml
mongo_port = 27017
mongo_user = "admin"
mongo_password = "admin"

# Create a MongoDB client
client = MongoClient(host=mongo_host, port=mongo_port, username=mongo_user, password=mongo_password)

db = client["bob"]
collection = db["test"]
print(db)
print(db.list_collection_names())

@app.get("/api/")
def read_root():
    return {"Hello": "World"}

@app.post("/create_document")
async def create_document():
    # Create a new document in the MongoDB collection
    global connection
    document = {"name": "John", "age": 30}
    result = collection.insert_one(document)
    return {"message": "Document created", "document_id": str(result.inserted_id)}

@app.get("/get_documents")
async def get_documents():
    global connection
    # Retrieve all documents from the MongoDB collection
    documents = list(collection.find())
    for document in documents:
        document["_id"] = str(document["_id"])
    return {"documents": documents}

