FROM node
WORKDIR /praxi
COPY package.json /praxi/
COPY package-lock.json /praxi/
RUN npm install