FROM node:14-alpine as build

ARG NEXT_PUBLIC_API_URL

ADD ./package.json /app/
ADD ./package-lock.json /app/

WORKDIR /app

RUN npm install

COPY ./ /app/

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
