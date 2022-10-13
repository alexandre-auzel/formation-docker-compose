FROM node:16
COPY ./package.json .
COPY ./package-lock.json .
RUN npm install
COPY app.js .
COPY .env .
CMD ["node", "app.js"]