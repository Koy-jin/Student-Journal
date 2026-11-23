# Nginx должен при первом запросе выдавать страницу логина. 
# 1) Установить nginx, скопировать файлы, обновить конфигурацию Nginx 
FROM nginx:1.27-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY  nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]