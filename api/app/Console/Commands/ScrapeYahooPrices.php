<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use GuzzleHttp\Client;
use Symfony\Component\DomCrawler\Crawler;
use Carbon\Carbon;

class ScrapeYahooPrices extends Command
{
    protected $signature = 'stocks:scrape-prices';
    protected $description = 'Scrape real-time prices from Yahoo Finance for tracked stocks';

    protected $tickers = [
        'AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META', 'TSLA', 'NVDA', 'BRK-A', 'V', 'JPM'
    ];

    public function handle()
    {
        $client = new Client([
            'headers' => [
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            ],
            'timeout' => 10,
        ]);
        foreach ($this->tickers as $ticker) {
            $symbol = $ticker === 'BRK-A' ? 'BRK-A' : $ticker;
            $url = "https://finance.yahoo.com/quote/{$symbol}";
            try {
                $response = $client->get($url);
                $html = (string) $response->getBody();
                $crawler = new Crawler($html);
                // Yahoo's price is in a span with data-field="regularMarketPrice" or similar
                $priceNode = $crawler->filter('fin-streamer[data-field="regularMarketPrice"]')->first();
                $price = $priceNode->count() ? $priceNode->text() : null;
                if ($price && is_numeric($price)) {
                    DB::table('stock_prices')->insert([
                        'ticker' => $ticker,
                        'price' => $price,
                        'recorded_at' => Carbon::now(),
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ]);
                    $this->info("Scraped price for $ticker: $price");
                } else {
                    $this->warn("Could not find price for $ticker");
                }
                sleep(2); // Be polite to Yahoo
            } catch (\Throwable $e) {
                $this->error("Error scraping $ticker: " . $e->getMessage());
            }
        }
        return 0;
    }
}
