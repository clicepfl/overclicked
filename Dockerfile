FROM node:latest

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
ENV NEXT_PUBLIC_BASE_URL=/overclicked
RUN npm run build

RUN mkdir /db
ENV OVERCLICKED_DB_DIR=/db

RUN chown -R node /db
USER node

CMD ["npm", "start"]
