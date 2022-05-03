FROM node:16 as builder
COPY . /app
WORKDIR /app
RUN yarn install --frozen-lockfile
RUN yarn build

FROM gcr.io/distroless/nodejs:16
COPY --from=builder /app/dist /app
CMD [ "--enable-source-maps", "/app/index.js" ]
