FROM node:12.18-alpine
ENV NODE_ENV development
RUN mkdir -p /usr/src/app/node_modules && chown -R node:node /usr/src/app
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
USER node
RUN npm install
COPY --chown=node:node . .
EXPOSE 3000 3004
CMD npm run test:coverage && npm run start
