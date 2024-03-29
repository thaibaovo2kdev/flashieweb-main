FROM node:18-alpine as builder
WORKDIR /my-space

COPY package.json package-lock.json ./
RUN npm ci --force
COPY . .
RUN npm run build

FROM node:18-alpine as runner
WORKDIR /my-space
COPY --from=builder /my-space/package.json .
COPY --from=builder /my-space/package-lock.json .
COPY --from=builder /my-space/next.config.js ./
COPY --from=builder /my-space/public ./public
COPY --from=builder /my-space/.next/standalone ./
COPY --from=builder /my-space/.next/static ./.next/static
RUN npm install next@13.5.2 --force
EXPOSE 3000
ENTRYPOINT ["npm", "start"]
