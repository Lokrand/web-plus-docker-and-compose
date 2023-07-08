FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build

FROM nginx:1.23.1-alpine AS production
EXPOSE 8082
COPY --from=builder /app/build /usr/share/nginx/html/
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]