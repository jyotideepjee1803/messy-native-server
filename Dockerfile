# base 
FROM node:22-slim

# working dir
WORKDIR /app

# copy package and install for pre-caching
COPY package*.json ./
RUN npm install

# copy remaining project files to working dir
COPY . .

CMD ["node","index.js"]
