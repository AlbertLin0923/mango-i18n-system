FROM node:20.16.0-slim

RUN apt-get update && apt-get install -y git

WORKDIR /home/app/server

COPY package.json pnpm-lock.yaml .npmrc ./

RUN npm install -g pnpm@9.6.0 && pnpm -v && pnpm install --frozen-lockfile

COPY . .

RUN pnpm prebuild && pnpm build

EXPOSE 8080

CMD [ "pnpm", "start" ]
