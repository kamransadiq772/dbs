FROM node:16-alpine

RUN mkdir -p /var/www/DBS-UserAccount-BE-001
WORKDIR /var/www/DBS-UserAccount-BE-001
ADD . /var/www/DBS-UserAccount-BE-001
RUN yarn config set network-timeout 600000 -g
RUN yarn install
CMD [ "yarn", "start:dev" ]
