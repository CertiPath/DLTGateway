FROM mhart/alpine-node:10

WORKDIR /app
COPY . .

# If you have native dependencies, you'll need extra tools
RUN apk add --no-cache make gcc g++ python

# npm will not install modules listed in devDependencies
RUN npm install --prod

CMD ["node", "index.js"]
