import os

import pymongo
from dotenv import load_dotenv
from pymongo import MongoClient

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
    tlsAllowInvalidCertificates=True,
)

USER_INFO_DB = MONGO_CLIENT[os.getenv("DATABASE_NAME")]
LOGIN_CREDENTIALS_COLLECTION = USER_INFO_DB["login_credentials"]
PROPERTY_LISTINGS_COLLECTION = USER_INFO_DB["properties"]
JWT_REVOCATION_COLLECTION = USER_INFO_DB["jwt_revocation"]
PROPERTY_DOCUMENTS_COLLECTION = USER_INFO_DB["property_documents"]
OTP_SEED_COLLECTION = USER_INFO_DB["totp_seeds"]
USER_REPORT_COLLECTION = USER_INFO_DB["user_reports"]

# TODO: Add indexing on KYC??
result = LOGIN_CREDENTIALS_COLLECTION.create_index(
    [("username", pymongo.ASCENDING)], unique=True
)

result = USER_REPORT_COLLECTION.create_index(
    [("username", pymongo.ASCENDING)], unique=True
)

OTP_SEED_COLLECTION.create_index([("username", pymongo.ASCENDING)], unique=True)

JWT_REVOCATION_COLLECTION.create_index([("username", pymongo.ASCENDING)], unique=True)
# result = LOGIN_CREDENTIALS_COLLECTION.create_index([("email", pymongo.ASCENDING)], unique=True)
