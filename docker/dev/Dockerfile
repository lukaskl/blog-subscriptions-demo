FROM node:8

WORKDIR /app

RUN wget https://github.com/Yelp/dumb-init/releases/download/v1.2.1/dumb-init_1.2.1_amd64.deb
RUN dpkg -i dumb-init_*.deb

EXPOSE 3010
ENTRYPOINT [ "dumb-init" ]
CMD [ "yarn", "start" ]
