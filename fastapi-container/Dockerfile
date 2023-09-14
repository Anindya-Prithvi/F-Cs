FROM python:alpine
WORKDIR /code
RUN apk add openssl
RUN openssl req -x509 -nodes -days 365 -newkey rsa:4096 -keyout /key.pem -out /cert.pem -subj "/CN=Eren Yeager/OU=Shiganshina/C=IN/ST=New Delhi/L=IIITD/O=F Cs" 
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
COPY ./app /code/app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "443", "--ssl-keyfile", "/key.pem", "--ssl-certfile", "/cert.pem"]
