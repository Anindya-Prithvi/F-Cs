# Problem Statement
An escrow service (wItH Bl0cKChAiN)

# How to start
1. Clone the repo
2. `npm install` in `newapp/`
3. Create a .env file in `fastapi-container/app` and specify `ACCESS_TOKEN_EXPIRE_MINUTES`, `SECRET_KEY=`, `ALGORITHM="HS-256"`
4. `docker compose up --build -d`
5. ez

# How to develop
1. Same steps as above
2. Then launch a python-alpine? container with fastapi and mount `fastapi-contianer` as a volume; install requirements and most importantly connect using `docker network connect f-cs_backend_network fastapidev` otherwise it'll not be able to reach the database.
3. Run a node-alpine container with volume as newapp for frontend.