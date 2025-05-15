FROM node:23-slim AS base

WORKDIR /app
COPY . /app

FROM base AS prod-deps
RUN  npm ci --only=production

FROM base AS build
RUN  npm ci
RUN npm run build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
EXPOSE 3000

CMD ["npm","run","start:prod"]
