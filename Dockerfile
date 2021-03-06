### STAGE 1: Build ###

# We label our stage as 'builder'
FROM node:8-alpine as build-env

COPY package.json package-lock.json ./

RUN npm set progress=false && npm config set depth 0 && npm cache clean --force

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm i && mkdir /ng-app && cp -R ./node_modules ./ng-app

WORKDIR /ng-app

COPY . .

## Build the angular app in production mode and store the artifacts in dist folder
RUN $(npm bin)/ng build --prod --build-optimizer

FROM gcr.io/distroless/nodejs
COPY --from=build-env /ng-app /ng-app
WORKDIR /ng-app
CMD ["server.js"]