FROM node:18.15.0

WORKDIR /home/app/server

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm -v && pnpm install --frozen-lockfile

COPY . .

RUN pnpm run prebuild && pnpm run build

EXPOSE 5006

CMD [ "pnpm", "run", "start:prod" ]
