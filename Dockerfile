FROM node:17-alpine3.14

WORKDIR /app
COPY . /app/

RUN yarn install --immutable
RUN yarn build

CMD [ "yarn", "start" ]