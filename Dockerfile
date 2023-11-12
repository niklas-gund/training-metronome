# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:18 as build
WORKDIR /app
COPY package*.json /app/
RUN npm i
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist  /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]