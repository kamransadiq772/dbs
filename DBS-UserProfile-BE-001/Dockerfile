FROM node:16-alpine

RUN mkdir -p /var/www/UserProfile
WORKDIR /var/www/UserProfile
ADD . /var/www/UserProfile
COPY ./.env.example /var/www/UserProfile/.env
RUN yarn config set network-timeout 600000 -g
RUN yarn install
CMD [ "yarn", "start:dev" ]
