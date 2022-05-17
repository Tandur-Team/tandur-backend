FROM node:14

WORKDIR /app

RUN npm install

ADD . /app

EXPOSE 8080
CMD [ "node", "server.js" ]