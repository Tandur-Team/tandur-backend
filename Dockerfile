FROM node:14

RUN npm install

WORKDIR /app

ADD . /app

CMD [ "node", "server.js" ]