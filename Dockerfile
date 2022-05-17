FROM node:16.14

RUN npm install

WORKDIR /app

ADD . /app

CMD node server.js