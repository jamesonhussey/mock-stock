<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class FetchStockPrices extends Command
{
    protected $signature = 'stocks:fetch-prices';
    protected $description = 'Fetch and store latest prices for tracked stocks using Alpha Vantage';

    // List your 10 tickers here
    protected $tickers = [
        'AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META', 'TSLA', 'NVDA', 'BRK-A', 'V', 'JPM'
    ];

    public function handle()
    {
        $apiKey = env('ALPHA_VANTAGE_API_KEY');
        if (!$apiKey) {
            $this->error('ALPHA_VANTAGE_API_KEY not set in .env');
            return 1;
        }
        foreach ($this->tickers as $ticker) {
            $symbol = $ticker === 'BRK-A' ? 'BRK.A' : $ticker; // Alpha Vantage uses dot for BRK.A
            $url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={$symbol}&apikey={$apiKey}";
            try {
                $response = Http::timeout(10)->get($url);
                $data = $response->json();
                $price = $data['Global Quote']['05. price'] ?? null;
                if ($price) {
                    DB::table('stock_prices')->insert([
                        'ticker' => $ticker,
                        'price' => $price,
                        'recorded_at' => Carbon::now(),
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ]);
                    $this->info("Saved price for $ticker: $price");
                } else {
                    Log::warning('Alpha Vantage: No price found', ['ticker' => $ticker, 'data' => $data]);
                    $this->warn("No price for $ticker");
                }
                // Alpha Vantage free tier: 5 calls/minute
                sleep(13); // Wait to avoid hitting the limit
            } catch (\Throwable $e) {
                Log::error('Alpha Vantage fetch failed', ['ticker' => $ticker, 'error' => $e->getMessage()]);
                $this->error("Error fetching $ticker: " . $e->getMessage());
            }
        }
        return 0;
    }
}
