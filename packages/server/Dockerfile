FROM node:20.10.0

WORKDIR /home/app/server

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm@8.12.1 && pnpm -v && pnpm install --frozen-lockfile

COPY . .

RUN pnpm prebuild && pnpm build

EXPOSE 5006

CMD [ "pnpm", "start" ]
