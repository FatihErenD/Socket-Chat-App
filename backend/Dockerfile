FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

FROM node:20-alpine
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/src ./src

ENV PORT=3000
EXPOSE 3000
CMD ["node", "src/index.js"]
