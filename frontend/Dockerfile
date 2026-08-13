# Use lightweight Nginx alpine image to serve static files
FROM nginx:alpine

# Copy all static frontend files to Nginx web root
COPY . /usr/share/nginx/html/

# Expose port 80 inside container
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
