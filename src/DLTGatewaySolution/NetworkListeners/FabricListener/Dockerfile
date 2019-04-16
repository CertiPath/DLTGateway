# FROM mhart/alpine-node:10

# If you have native dependencies, you'll need extra tools
#RUN apk add --no-cache make gcc g++ python

FROM mcr.microsoft.com/mssql-tools

WORKDIR /app
COPY . .

# Install Node v10
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get update
RUN apt-cache policy nodejs
RUN apt-get install -y nodejs

# The build-essential package is required for building node-gyp
RUN apt-get install -y build-essential

RUN npm install --prod

CMD ["npm", "start"]
