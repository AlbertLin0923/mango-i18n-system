FROM node:18.15.0 as builder

WORKDIR /home/app/client

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm -v && pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build:production



FROM nginx

WORKDIR /usr/share/nginx/html/

COPY ./nginx/ /etc/nginx/

COPY --from=builder /home/app/client/build  /usr/share/nginx/html/

EXPOSE 5005

CMD ["nginx", "-g", "daemon off;"]