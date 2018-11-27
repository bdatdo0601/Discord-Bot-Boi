# node environment 
FROM node:current-alpine

# set app directory
WORKDIR /usr/src/dabotboi-app

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

# add necessary program and install dependencies
RUN apk add --no-cache --virtual .gyp \
  python \
  make \
  g++ \
  && yarn install --production \
  && apk del .gyp


# copy over code
COPY src/ ./src/

# execute
CMD ["yarn", "deploy"]