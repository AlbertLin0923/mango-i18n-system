FROM node:20.16.0-slim as builder

WORKDIR /home/app/client

COPY package.json pnpm-lock.yaml .npmrc ./

RUN npm install -g pnpm@9.6.0 && pnpm -v && pnpm install --frozen-lockfile

COPY . .

RUN pnpm build:prod



FROM nginx

WORKDIR /usr/share/nginx/html/

COPY ./nginx/ /etc/nginx/

COPY --from=builder /home/app/client/dist  /usr/share/nginx/html/

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]