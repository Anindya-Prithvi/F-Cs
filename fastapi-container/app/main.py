from fastapi import FastAPI, Depends
from app.routers.login import router as login_router

app = FastAPI()
app.include_router(login_router)


@app.get("/api/")
def read_root():
    return {"Hello": "World"}
