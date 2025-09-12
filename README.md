# MockStock

A full-stack mock stock trading MVP built with Laravel, React, and Material Design. Every user starts with $25,000!

## Features
- Register, login, and secure fake trading with JWT auth
- Real-time stock prices for 10 major US stocks (via Alpha Vantage, stored in SQLite DB)
- Buy/sell stocks with instant portfolio updates
- Portfolio summary and recent trades dashboard
- Historical price storage for past and future charting
- Material UI for a clean, modern interface

## Tech Stack
- **Backend:** Laravel 12, Sanctum, SQLite, Alpha Vantage API
- **Frontend:** React, Vite, TypeScript, Material UI, React Query

## Setup

### Backend (Laravel)
1. `cd api`
2. `composer install`
3. Copy `.env.example` to `.env` and set your DB and Alpha Vantage API key. (This is a free API key, takes less than 30 seconds to get)
4. `php artisan key:generate`
5. `php artisan migrate --seed` (or `php artisan migrate:fresh --seed` for a reset)
6. Start the backend: `php -S 127.0.0.1:8000 -t public`
7. (Optional) Start the price fetcher: `php artisan schedule:work` or run manually: `php artisan stocks:fetch-prices`

### Frontend (React)
1. `cd web`
2. `npm install`
3. `npm run dev`

### Usage
- Visit [http://localhost:5173](http://localhost:5173) in your browser
- Register a user, log in, and start "trading"!

## Notes
- Only 10 stocks are supported (see `SymbolsTableSeeder`)
- Prices update every 10 minutes (by default)
- For charting, use the historical data in the `stock_prices` table