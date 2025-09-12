<?php


namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;

class QuoteService
{
    /**
     * Get current quotes for the given tickers.
     *
     * @param array $tickers
     * @return array
     */
    public function getCurrentQuotes(array $tickers): array
    {
        // Fetch the latest price for each ticker from stock_prices table
        $quotes = [];
        foreach ($tickers as $ticker) {
            $row = DB::table('stock_prices')
                ->where('ticker', $ticker)
                ->orderByDesc('recorded_at')
                ->first();
            if ($row) {
                $quotes[] = [
                    'ticker' => $ticker,
                    'price' => (float)$row->price,
                    'ts' => $row->recorded_at,
                ];
            } else {
                $quotes[] = [
                    'ticker' => $ticker,
                    'price' => null,
                    'ts' => null,
                ];
            }
        }
        return $quotes;
    }
    // Fetch real-time price from Yahoo Finance public endpoint
    private function yahooQuote($ticker): array
    {
        $cacheKey = 'quote:' . $ticker;
        try {
            // Yahoo uses BRK-A for Berkshire Hathaway
            $symbol = $ticker === 'BRK.A' ? 'BRK-A' : $ticker;
            $url = 'https://query1.finance.yahoo.com/v7/finance/quote?symbols=' . urlencode($symbol);
            $response = Http::timeout(5)->get($url);
            $data = $response->json();
            // Debug: log the raw Yahoo response
            Log::debug('Yahoo API response', ['ticker' => $ticker, 'url' => $url, 'data' => $data]);
            $result = $data['quoteResponse']['result'][0] ?? null;
            $price = $result['regularMarketPrice'] ?? null;
            $ts = isset($result['regularMarketTime']) ? Carbon::createFromTimestamp($result['regularMarketTime'])->toIso8601String() : now()->toIso8601String();
            $quote = [
                'ticker' => $ticker,
                'price' => $price,
                'ts' => $ts,
            ];
            Cache::put($cacheKey, $quote, 30);
            return $quote;
        } catch (\Throwable $e) {
            Log::error('Yahoo quote fetch failed', ['ticker' => $ticker, 'error' => $e->getMessage()]);
            // fallback to mock if Yahoo fails
            return $this->mockQuote($ticker);
        }
    }

    private function mockQuote($ticker): array
    {
        $cacheKey = 'quote:' . $ticker;
        $last = Cache::get($cacheKey);
        $price = $last['price'] ?? rand(1000, 50000) / 100;
        // Random walk
        $price = round($price * (1 + (rand(-50, 50) / 10000)), 2);
        $quote = [
            'ticker' => $ticker,
            'price' => $price,
            'ts' => now()->toIso8601String(),
        ];
        Cache::put($cacheKey, $quote, 30);
        return $quote;
    }

    private function alpacaQuote($ticker): array
    {
        $apiKey = env('ALPACA_API_KEY');
        $apiSecret = env('ALPACA_API_SECRET');
        $url = env('ALPACA_DATA_URL', 'https://data.alpaca.markets/v2');
        $endpoint = "$url/stocks/quotes/latest?symbols=$ticker";
        $response = Http::withHeaders([
            'APCA-API-KEY-ID' => $apiKey,
            'APCA-API-SECRET-KEY' => $apiSecret,
        ])->get($endpoint);
        $data = $response->json();
        $price = $data['quotes'][$ticker]['ap'] ?? $data['quotes'][$ticker]['bp'] ?? $data['quotes'][$ticker]['p'] ?? null;
        $ts = $data['quotes'][$ticker]['t'] ?? now()->toIso8601String();
        $quote = [
            'ticker' => $ticker,
            'price' => $price,
            'ts' => $ts,
        ];
        Cache::put('quote:' . $ticker, $quote, 30);
        return $quote;
    }
}
