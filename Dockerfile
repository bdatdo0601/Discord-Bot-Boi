# node v10 environment 
FROM node:10

# set app directory
WORKDIR /usr/src/dabotboi-app

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

# install depedencies 
RUN yarn install --production

# copy over code
COPY src/ ./src/

# execute
CMD ["yarn", "deploy"]