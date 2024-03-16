FROM node:20.10.0 as builder

WORKDIR /home/app/client

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm@8.12.1 && pnpm -v && pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build:prod



FROM nginx

WORKDIR /usr/share/nginx/html/

COPY ./nginx/ /etc/nginx/

COPY --from=builder /home/app/client/build  /usr/share/nginx/html/

EXPOSE 5005

CMD ["nginx", "-g", "daemon off;"]