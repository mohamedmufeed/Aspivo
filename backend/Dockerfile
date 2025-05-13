
FROM node:alpine:3.20


WORKDIR /app


COPY package*.json ./
RUN npm install


COPY . .


RUN npm run build


RUN npm install ts-node typescript @types/node --save-dev


EXPOSE 5001
EXPOSE 9000


CMD ["npm", "start"]
