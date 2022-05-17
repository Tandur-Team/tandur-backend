FROM node:13-slim

RUN npm install

WORKDIR /app

ADD . /app

CMD node server.js