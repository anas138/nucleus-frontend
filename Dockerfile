# Step 1: Use a Node.js base image for the build stage
FROM node:16-alpine as build

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Step 4: Install dependencies
RUN yarn install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Build the application
RUN yarn build

# Step 7: Use a lightweight web server to serve the built files
FROM nginx:alpine

# Step 8: Remove the default nginx configuration file
RUN rm -rf /etc/nginx/conf.d/default.conf

# Step 9: Copy custom nginx configuration file
COPY default.conf /etc/nginx/conf.d/

# Step 10: Copy the built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Step 11: Copy .env file to the container
COPY .env /usr/share/nginx/html/.env

# Step 12: Expose port 80
EXPOSE 80

# Step 13: Start Nginx server
CMD ["nginx", "-g", "daemon off;"]