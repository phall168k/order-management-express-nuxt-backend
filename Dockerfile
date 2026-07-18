FROM node:22-alpine AS base

WORKDIR /app

COPY package.json package-lock.json ./

FROM base AS development

ENV NODE_ENV=development

RUN npm ci

COPY . .

EXPOSE 8000

CMD ["npm", "run", "dev"]

FROM base AS build

RUN npm ci

COPY . .

RUN npm run build

FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist

USER node

EXPOSE 8000

CMD ["node", "dist/server.js"]
