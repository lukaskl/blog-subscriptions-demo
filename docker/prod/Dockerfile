FROM keymetrics/pm2:8-alpine

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn

WORKDIR /app

EXPOSE 3010

COPY build/prod-docker/ .

# CMD [ "pm2-runtime", "start", "pm2.json" ]
CMD [ "pm2-runtime", "build/prod/server.js" ]
# CMD [ "node", "build/prod/server.js" ]
