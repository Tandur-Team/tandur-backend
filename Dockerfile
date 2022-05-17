FROM node:16.4

WORKDIR /app

RUN npm install
COPY . .
CMD node server.js