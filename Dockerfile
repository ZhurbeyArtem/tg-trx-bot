FROM node:20.12.2

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .
COPY ./dist ./dist

CMD ["npm", "run" , "start"]