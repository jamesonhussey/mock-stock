<?php
// Yahoo Finance API has strict rate limits, so Finnhub is used for real time data instead.
// I'm still going to leave this here for now in case there are unforeseen issues with Finnhub.
namespace App\Console\Commands;

use Illuminate\Console\Command;
use Scheb\YahooFinanceApi\ApiClientFactory;
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
        $client = ApiClientFactory::createApiClient();
        // Yahoo uses dash for BRK-A
        $symbols = array_map(fn($t) => $t === 'BRK-A' ? 'BRK-A' : $t, $this->tickers);
        try {
            $quotes = $client->getQuotes($symbols);
            foreach ($quotes as $quote) {
                $ticker = $quote->getSymbol();
                $price = $quote->getRegularMarketPrice();
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
                    Log::warning('Yahoo Finance: No price found', ['ticker' => $ticker]);
                    $this->warn("No price for $ticker");
                }
            }
        } catch (\Throwable $e) {
            Log::error('Yahoo Finance fetch failed', ['error' => $e->getMessage()]);
            $this->error("Error fetching quotes: " . $e->getMessage());
        }
        return 0;
    }
}
