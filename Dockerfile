FROM node:13-slim

RUN npm install

WORKDIR /app

ADD . /app

EXPOSE 8080
CMD node server.js