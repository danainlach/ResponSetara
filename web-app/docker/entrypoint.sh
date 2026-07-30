#!/bin/sh
set -e

# 1. Ensure storage and bootstrap/cache directories are writable
echo "Configuring directory permissions..."
mkdir -p /var/www/html/storage/framework/sessions
mkdir -p /var/www/html/storage/framework/views
mkdir -p /var/www/html/storage/framework/cache/data
mkdir -p /var/www/html/bootstrap/cache

chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# 2. Generate Nginx configuration from PORT
PORT_VAL=${PORT:-8080}
echo "Configuring Nginx to listen on port ${PORT_VAL}..."
sed "s/\${PORT}/${PORT_VAL}/g" /var/www/html/docker/nginx.conf.template > /etc/nginx/nginx.conf

# 3. Cache configuration, routes, and views for production runtime
echo "Caching Laravel configuration, routes, and views..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 4. Run migrations if RUN_MIGRATIONS_ON_START is true
if [ "$RUN_MIGRATIONS_ON_START" = "true" ]; then
    echo "Running database migrations..."
    if php artisan migrate --force; then
        echo "Database migrations completed successfully."
    else
        echo "ERROR: Database migrations failed! Stopping container startup." >&2
        exit 1
    fi
else
    echo "Database migration on startup is disabled (RUN_MIGRATIONS_ON_START is not true)."
fi

# 5. Run UserSeeder if SEED_ADMIN_ON_START is true
if [ "$SEED_ADMIN_ON_START" = "true" ]; then
    if [ -n "$ADMIN_NAME" ] && [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ]; then
        echo "Running initial administrator database seeder..."
        if php artisan db:seed --class=UserSeeder --force; then
            echo "Administrator seeding completed successfully."
        else
            echo "WARNING: Administrator seeding failed. Proceeding with startup." >&2
        fi
    else
        echo "INFO: SEED_ADMIN_ON_START is true but one or more admin parameters (ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD) are missing. Skipping seeder."
    fi
else
    echo "Database seeding on startup is disabled (SEED_ADMIN_ON_START is not true)."
fi

# 6. Start PHP-FPM in background
echo "Starting PHP-FPM..."
php-fpm -D

# 7. Start Nginx in foreground
echo "Starting Nginx..."
exec nginx -g "daemon off;"
