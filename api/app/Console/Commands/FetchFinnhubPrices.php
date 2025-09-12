<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use GuzzleHttp\Client;
use Carbon\Carbon;

class FetchFinnhubPrices extends Command
{
    protected $signature = 'stocks:finnhub-prices {--loop : Continuously fetch prices every 2 minutes}';
    protected $description = 'Fetch real-time prices from Finnhub for tracked stocks';

    protected $tickers = [
        'AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META', 'TSLA', 'NVDA', 'BRK.A', 'V', 'JPM'
    ];

    public function handle()
    {
        $apiKey = env('FINNHUB_API_KEY');
        if (!$apiKey) {
            $this->error('FINNHUB_API_KEY not set in .env');
            return 1;
        }
        $client = new Client(['base_uri' => 'https://finnhub.io/api/v1/']);
        do {
            foreach ($this->tickers as $ticker) {
                try {
                    $response = $client->get('quote', [
                        'query' => [
                            'symbol' => $ticker,
                            'token' => $apiKey,
                        ],
                        'timeout' => 10,
                    ]);
                    $data = json_decode($response->getBody(), true);
                    $price = $data['c'] ?? null; // 'c' is current price
                    if ($price) {
                        DB::table('stock_prices')->insert([
                            'ticker' => $ticker,
                            'price' => $price,
                            'recorded_at' => Carbon::now(),
                            'created_at' => Carbon::now(),
                            'updated_at' => Carbon::now(),
                        ]);
                        $this->info("Finnhub price for $ticker: $price");
                    } else {
                        $this->warn("No price for $ticker");
                    }
                    sleep(1); // Be polite to Finnhub
                } catch (\Throwable $e) {
                    $this->error("Error fetching $ticker: " . $e->getMessage());
                }
            }
            if ($this->option('loop')) {
                $this->info('Waiting 9 mins and 50 seconds before next fetch...');
                sleep(590);
            }
        } while ($this->option('loop'));
        return 0;
    }
}