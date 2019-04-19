FROM mhart/alpine-node:10

# If you have native dependencies, you'll need extra tools
RUN apk add --no-cache make gcc g++ python

WORKDIR /app
COPY . .

RUN npm install --prod

CMD ["npm", "start"]
