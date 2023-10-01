from pymongo import MongoClient
import pymongo
from dotenv import load_dotenv
import os
import pathlib

load_dotenv()

mongo_client = None
mongo_host = "mongodb"  # This is the service name from docker-compose.yml
mongo_port = 27017
mongo_user = os.getenv("DATABASE_USER")
mongo_password = os.getenv("DATABASE_PASSWORD")


# Create a MongoDB client
MONGO_CLIENT = MongoClient(
    host=mongo_host, 
    port=mongo_port, 
    username=mongo_user, 
    password=mongo_password, 
    tls=True,
    tlsAllowInvalidCertificates=True
)

USER_INFO_DB = MONGO_CLIENT[os.getenv("DATABASE_NAME")]
LOGIN_CREDENTIALS_COLLECTIONS = USER_INFO_DB["login_credentials"]
result = LOGIN_CREDENTIALS_COLLECTIONS.create_index([("username", pymongo.ASCENDING)], unique=True)
# result = LOGIN_CREDENTIALS_COLLECTIONS.create_index([("email", pymongo.ASCENDING)], unique=True)

