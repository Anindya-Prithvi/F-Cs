import os

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware

from app.routers.database import router as db_router
from app.routers.document_verification import router as document_verification_router
from app.routers.edituser import router as edituser_router
from app.routers.kyc import router as kyc_router
from app.routers.login import router as login_router
from app.routers.logout import router as logout_router
from app.routers.otp import router as otp_router
from app.routers.property import router as property_router

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
    response = await call_next(request)
    response.headers["X-Secret-Key"] = "HAHAHAHAHHA lmao"
    response.headers["X-password"] = "HAHAHAHAHHA lmao squared"
    return response


app.add_middleware(HTTPSRedirectMiddleware)
app.include_router(login_router)
app.include_router(db_router)
app.include_router(property_router)
app.include_router(logout_router)
app.include_router(document_verification_router)
app.include_router(edituser_router)
app.include_router(kyc_router)
app.include_router(otp_router)
