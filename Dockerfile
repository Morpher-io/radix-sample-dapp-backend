FROM public.ecr.aws/docker/library/node:22-alpine as build

# Create app directory
WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build

FROM public.ecr.aws/docker/library/node:22-alpine

RUN node --version
WORKDIR /app
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
CMD ["node","dist/index.js"] 

