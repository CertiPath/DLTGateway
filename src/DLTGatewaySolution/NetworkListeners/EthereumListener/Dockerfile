FROM python

# RUN apk update

# RUN apk add --no-cache --virtual .build-deps gcc musl-dev

WORKDIR /app
COPY . .

# RUN pip install Cython

# RUN apk del .build-deps gcc musl-dev


RUN pip install -r requirements.txt

CMD ["python", "ethereumListener.py"]
