<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Scheb\YahooFinanceApi\ApiClientFactory;
use App\Models\Symbol;
use App\Models\StockPrice;
use Carbon\Carbon;

class FetchHistoricalPrices extends Command
{
    protected $signature = 'fetch:historical-prices';
    protected $description = 'Fetch and store historical price snapshots for all stocks';

    public function handle()
    {
    $symbols = Symbol::pluck('ticker');
        $client = ApiClientFactory::createApiClient();
        foreach ($symbols as $symbol) {
            $this->info("Fetching historical prices for $symbol...");
            $now = now();
            $snapshots = [];
            // Fetch daily candles for the last 5 years
            $start = $now->copy()->subYears(5);
            try {
                $historical = $client->getHistoricalQuoteData(
                    $symbol,
                    \Scheb\YahooFinanceApi\ApiClient::INTERVAL_1_DAY,
                    $start,
                    $now
                );
            } catch (\Throwable $e) {
                $this->error("Error fetching Yahoo data for $symbol: " . $e->getMessage());
                continue;
            }
            // Index by date for easy lookup
            $byDate = [];
            foreach ($historical as $row) {
                $byDate[$row->getDate()->format('Y-m-d')] = $row->getClose();
            }
            // 12h for past week (use closest daily)
            $t = $now->copy()->startOfHour();
            for ($i = 0; $i < 14; $i++) {
                $date = $t->copy()->subHours($i * 12)->toDateString();
                $price = $byDate[$date] ?? null;
                if ($price) $snapshots[] = ['ticker' => $symbol, 'price' => $price, 'recorded_at' => $date];
            }
            // 1d for past month
            for ($i = 1; $i <= 30; $i++) {
                $date = $now->copy()->subDays($i)->toDateString();
                $price = $byDate[$date] ?? null;
                if ($price) $snapshots[] = ['ticker' => $symbol, 'price' => $price, 'recorded_at' => $date];
            }
            // 1w for past year
            for ($i = 1; $i <= 52; $i++) {
                $date = $now->copy()->subWeeks($i)->toDateString();
                $price = $byDate[$date] ?? null;
                if ($price) $snapshots[] = ['ticker' => $symbol, 'price' => $price, 'recorded_at' => $date];
            }
            // 1m for past 5 years
            for ($i = 1; $i <= 60; $i++) {
                $date = $now->copy()->subMonths($i)->toDateString();
                $price = $byDate[$date] ?? null;
                if ($price) $snapshots[] = ['ticker' => $symbol, 'price' => $price, 'recorded_at' => $date];
            }
            foreach ($snapshots as $snap) {
                StockPrice::updateOrCreate([
                    'ticker' => $snap['ticker'],
                    'recorded_at' => $snap['recorded_at'],
                ], [
                    'price' => $snap['price'],
                ]);
            }
            $this->info("Stored " . count($snapshots) . " historical price snapshots for $symbol");
        }
        $this->info('Historical price fetching complete.');
    }

    // No longer needed: getPriceForDate (handled by $byDate lookup)
}
