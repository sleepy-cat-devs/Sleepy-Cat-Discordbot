FROM node
WORKDIR /praxi
COPY package.json /praxi/
COPY package-lock.json /praxi/
RUN npm install
RUN npm install -g npm-check-updates
RUN apt update
RUN apt install -y sqlite3