FROM node:18-alpine as build

WORKDIR /app

COPY ./apps/lermo-gen-web /app/apps/web
COPY ./packages /app/packages
COPY ./turbo.json /app/turbo.json
COPY ./package.json /app/package.json
COPY ./.npmrc /app/.npmrc
COPY ./pnpm-lock.yaml /app/pnpm-lock.yaml
COPY ./pnpm-workspace.yaml /app/pnpm-workspace.yaml

RUN npm i pnpm -g
RUN pnpm install

RUN pnpm build

WORKDIR /app/apps/web
EXPOSE 3000
CMD pnpm start