FROM node:alpine

RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app

WORKDIR /usr/src/node-app

COPY package.json package-lock ./

USER node

RUN npm install --pure-lockfile

COPY --chown=node:node . .

EXPOSE 3000
