# SRM - Municipal Reporting System

A modern, robust, and accessible platform for citizens to report municipal issues and track their resolution. Nicknamed "Intendencia en tu Mano" (City Hall in Your Hand).

## About The Project

The Municipal Reporting System (SRM) is designed to centralize and streamline the process of handling citizen complaints and requests. It replaces fragmented channels like phone calls and emails with a single, unified digital platform.

The main goals are:
*   **Provide a simple and intuitive channel** for citizens to report issues like potholes, broken streetlights, waste accumulation, etc.
*   **Incorporate geolocation** for every report to precisely locate issues.
*   **Establish a transparent lifecycle** for each report, allowing citizens to track its status from submission to resolution.
*   **Generate statistics and dashboards** for municipal authorities to identify critical areas and improve infrastructure planning.

## Key Features

*   📝 **Report Submission:** Create reports with descriptions, categories, geolocation, and multimedia evidence (photos, videos).
*   🗺️ **Interactive Map:** View and filter reports on a map.
*   🔔 **Real-time Notifications:** Citizens receive automatic updates (email, push, SMS) as their report's status changes.
*   🔐 **Role-Based Access Control (RBAC):** Different user roles with specific permissions (`Citizen`, `Employee`, `Supervisor`, `Administrator`).
*   📊 **Analytics Dashboard:** Internal dashboard for supervisors with statistics, heatmaps, and charts on report resolution times and volumes.
*   🔒 **Security-First Design:** Built with a strong focus on data security, privacy, and system integrity.
*   ♿ **Accessibility:** Designed to comply with WCAG 2.1 standards for digital accessibility.

## Tech Stack

The project is built using a modern and reliable stack.

### Backend

*   **Framework:** [Laravel](https://laravel.com/) (PHP 8.3)
*   **Database:** [MariaDB](https://mariadb.org/) / [MySQL](https://www.mysql.com/) (SQLite by default for local/dev)
*   **Web Server:** [FrankenPHP](https://frankenphp.dev/) (Caddy-based)
*   **API:** RESTful API
*   **Authentication:** Session-based (Laravel sessions/CSRF)
*   **OS:** Debian GNU/Linux

### Frontend

*   **UI Framework:** [Tailwind CSS](https://tailwindcss.com/) + [RadixUI](https://www.radix-ui.com/)
*   **JS Framework:** [`React`](https://react.dev)
*   **Mapping Library:** `OpenLayers` or `Leaflet`
*   **Bundler:** [Vite](https://vitejs.dev/)

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

*   PHP >= 8.3
*   Composer
*   Node.js v22+ & npm
*   A local database server (MariaDB or MySQL) or SQLite

### Installation

1.  **Clone the repo:**
    ```sh
    git clone https://github.com/your_username/srm-project.git
    cd srm-project
    ```
2.  **Install PHP dependencies:**
    ```sh
    composer install
    ```
3.  **Install NPM dependencies:**
    ```sh
    npm install
    ```
4.  **Setup environment file:**
    ```sh
    cp .env.example .env
    ```
5.  **Generate application key:**
    ```sh
    php artisan key:generate
    ```
6.  **Configure your `.env` file** with your local database credentials (`DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`).

7.  **Run database migrations and seeders:**
    ```sh
    php artisan migrate --seed
    ```
8.  **Run the development servers:**
    In one terminal, run the backend server:
    ```sh
    php artisan serve
    ```
    In another terminal, run the Vite frontend server for hot-reloading:
    ```sh
    npm run dev
    ```
9.  Open your browser and navigate to `http://localhost:8000`.

## Security Considerations

This project specification mandates a "Defense in Depth" security architecture. Key measures include:

*   **Network Segmentation:** A DMZ for the web server and an internal LAN for critical services like the database.
*   **Firewalls:** Dual `Shorewall` firewalls (perimeter and internal) with `iptables` rules.
*   **Secure Communications:** All traffic is enforced over HTTPS (TLS 1.2+).
*   **Robust Hashing:** User passwords are to be hashed using `bcrypt` or `Argon2`.
*   **VPN Access:** Administrative access to servers requires a secure VPN connection.
*   **Compliance:** Designed to comply with data protection regulations like GDPR and Ley 18.331 (Uruguay).

## License

Distributed under the MIT License. See `LICENSE` file for more information.

## Acknowledgments

*   This project is based on the ESRE (Software Requirements Specification) created by the **Fenix Dev Team**.

---

## Current Setup (Production)

This repository currently deploys a Laravel + Inertia (React + TypeScript) application to Fly.io using FrankenPHP as the runtime web server.

- Runtime: PHP 8.3 on FrankenPHP (Caddy-based). Note: despite the "Apache" mention above, production currently runs on FrankenPHP.
- Hosting: Fly.io (primary region defined in `fly.toml`).
- Frontend: Vite + Tailwind; alias `@` points to `resources/js`.
- Inertia SSR: disabled by default (`INERTIA_SSR_ENABLED=false`). Can be enabled later.
- Typed routes/actions: `@laravel/vite-plugin-wayfinder` generates `resources/js/routes/**` and `resources/js/actions/**`.
  - In production builds the plugin is disabled; generated files are committed to the repo so CI does not need PHP to generate them.

## Local Development (updated)

1) Requirements: PHP 8.3, Composer, Node.js 22, npm.
2) Install dependencies:
```bash
composer install
npm ci
```
3) Environment and key:
```bash
cp .env.example .env
php artisan key:generate
```
4) Migrate DB (SQLite by default):
```bash
php artisan migrate
```
5) Start dev servers:
```bash
php artisan serve    # backend
npm run dev          # Vite
```

## Frontend Build (Vite)

```bash
npm run build
```
Artifacts are written to `public/build` with a `public/build/manifest.json`.

Wayfinder notes:
- Dev: the plugin may call `php artisan wayfinder:generate` automatically.
- Prod: commit the generated files so CI can build without PHP:
```bash
php artisan wayfinder:generate --with-form
git add resources/js/routes resources/js/actions resources/js/wayfinder
git commit -m "chore(wayfinder): regenerate routes/actions"
```

## Deployment (Fly.io)

Runtime is started by FrankenPHP:
```text
frankenphp php-server -r public/ -l :8080
```

Release command (see `fly.toml`) runs:
```text
php artisan package:discover --ansi && php artisan migrate --force && php artisan optimize
```

Manual deploy:
```bash
flyctl deploy --remote-only -a <app-name>
```

### Environment & Secrets

Set in `fly.toml` or as secrets:
- `APP_URL` and `ASSET_URL` (e.g. `https://fenix.ivaliev.dev`)
- `INERTIA_SSR_ENABLED=false` (can be enabled later)
- `CACHE_STORE=file`, `SESSION_DRIVER=file`

Secrets example:
```bash
flyctl secrets set APP_KEY=base64:... APP_URL=https://<domain>
```

### Healthcheck

- Use Laravel route `GET /up` which returns `200 OK` when the app is healthy.

## GitHub Actions

Workflow file: `.github/workflows/deploy.yml`.

- Add `FLY_API_TOKEN` in GitHub → Repository → Settings → Secrets and variables → Actions.
  - Generate via `flyctl tokens create deploy` (preferred) or `flyctl auth token`.
- The deploy step runs:
```bash
flyctl deploy --remote-only -a <app-name>
```

## Troubleshooting (CI/Vite)

- If Vite fails with missing modules like `resources/js/routes/index.ts` or `resources/js/actions/...Controller.ts` during CI:
  - Ensure Wayfinder-generated files are committed to the repository (see the command above).
  - The Vite alias `@` should resolve to `resources/js` (configured in `vite.config.ts`).
  - In production builds, imports may need explicit filenames (e.g., `@/routes/index.ts`).