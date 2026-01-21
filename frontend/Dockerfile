# -------- Stage 1: Build --------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# -------- Stage 2: Serve --------
FROM nginxinc/nginx-unprivileged:alpine

USER root
RUN apk add --no-cache gettext

COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=builder /app/dist /usr/share/nginx/html

USER 101
EXPOSE 8080

CMD ["sh", "-c", "envsubst '$BACKEND_HOST' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]


#FROM nginxinc/nginx-unprivileged:alpine
#
## Remove default config
#RUN rm /etc/nginx/conf.d/default.conf
#
## Copy custom config
#COPY nginx.conf /etc/nginx/conf.d/default.conf
#
## Copy built files
#COPY --from=builder /app/dist /usr/share/nginx/html
#
#EXPOSE 8080
#CMD ["nginx", "-g", "daemon off;"]
