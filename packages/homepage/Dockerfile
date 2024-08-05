FROM nginx

WORKDIR /usr/share/nginx/html/

COPY ./nginx/ /etc/nginx/

COPY ./build  /usr/share/nginx/html/

EXPOSE 81

CMD ["nginx", "-g", "daemon off;"]