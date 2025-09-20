# syntax=docker/dockerfile:1.7-labs

# --- Build frontend (Vite) ---
FROM node:22-bookworm AS assets
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY resources ./resources
COPY vite.config.ts tsconfig.json ./
RUN npm run build

# --- PHP dependencies ---
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN --mount=type=cache,target=/tmp/cache composer install --no-dev --no-interaction --no-progress --prefer-dist --optimize-autoloader --no-scripts

# --- Runtime image ---
FROM dunglas/frankenphp:1.4-php8.3-bookworm AS runtime
# FrankenPHP включает встроенный веб-сервер и PHP-FPM, удобно для fly.io

WORKDIR /app

# PHP extensions (required by Laravel)
RUN install-php-extensions \
    pdo_mysql \
    opcache \
    openssl \
    tokenizer \
    ctype \
    dom \
    simplexml \
    mbstring \
    xml \
    fileinfo \
    curl \
    bcmath \
    intl \
    zip \
    gd

# Copy application
COPY --from=vendor /app/vendor /app/vendor
COPY . /app
# Copy built assets
COPY --from=assets /app/resources /app/resources
COPY --from=assets /app/public/build /app/public/build

# Remove stale Laravel caches
RUN rm -f /app/bootstrap/cache/packages.php /app/bootstrap/cache/services.php /app/bootstrap/cache/config.php /app/bootstrap/cache/routes-*.php || true

# Ensure storage framework directories exist
RUN mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs \
 && chown -R www-data:www-data storage bootstrap/cache \
 && chmod -R ug+rw storage bootstrap/cache

# Environment
ENV APP_ENV=production \
    INERTIA_SSR_ENABLED=false \
    INERTIA_SSR_URL=http://127.0.0.1:13714 \
    SERVER_NAME=:8080 \
    LOG_CHANNEL=stderr \
    LOG_LEVEL=debug \
    APP_DEBUG=true

# Expose web port for fly
EXPOSE 8080

# (optional) PHP ini tweaks
RUN mkdir -p /app/.infra \
 && printf "opcache.enable=1\nopcache.jit_buffer_size=0\n" > /app/.infra/php.ini

# Start FrankenPHP simple PHP server
CMD ["frankenphp", "php-server", "-r", "public/", "-l", ":8080"]
