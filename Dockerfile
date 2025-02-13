FROM node:22-slim

WORKDIR /app

COPY package.json .

RUN npm install

RUN apt-get update && apt-get install -y nano

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start" ]
