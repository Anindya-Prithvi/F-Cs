from fastapi import FastAPI, Request
from app.routers.login import router as login_router
from app.routers.database import router as db_router
from app.routers.property import router as property_router
from pymongo import MongoClient
import time
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

if os.getenv("ALLOWDEV"):
    origins = [
        "http://192.168.2.233:3000",
    ]
    print("ALLOWING CORS for", origins)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


app.add_middleware(HTTPSRedirectMiddleware)
app.include_router(login_router)
app.include_router(db_router)
app.include_router(property_router)

