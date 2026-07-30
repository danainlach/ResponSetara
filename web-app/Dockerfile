# ==========================================
# STAGE 1: Frontend Builder
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ==========================================
# STAGE 2: Composer Builder
# ==========================================
FROM composer:2.2 AS composer-builder
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --ignore-platform-reqs

# ==========================================
# STAGE 3: Production Runtime Environment
# ==========================================
FROM php:8.4-fpm-alpine AS runtime

# Install system dependencies & Nginx
RUN apk add --no-cache \
    nginx \
    postgresql-dev \
    libpq \
    curl \
    git \
    unzip

# Build & install required PHP Extensions
RUN docker-php-ext-install pdo_pgsql pgsql opcache

# Copy custom configurations
COPY docker/php.ini /usr/local/etc/php/conf.d/production-php.ini
COPY docker/opcache.ini /usr/local/etc/php/conf.d/production-opcache.ini

# Set working directory
WORKDIR /var/www/html

# Copy application source code
COPY . .

# Copy dependencies and frontend assets from builders
COPY --from=composer-builder /app/vendor/ ./vendor/
COPY --from=frontend-builder /app/public/build/ ./public/build/

# Delete development/unused files to keep image lightweight
RUN rm -rf node_modules \
    tests \
    tests-e2e \
    playwright.config.ts \
    vite.config.ts \
    public/hot

# Expose executable permission to the entrypoint script
RUN chmod +x docker/entrypoint.sh

# Configure environment variables
ENV APP_ENV=production
ENV APP_DEBUG=false

# Expose the starting port (Render will inject its PORT variable)
EXPOSE 8080

ENTRYPOINT ["docker/entrypoint.sh"]
