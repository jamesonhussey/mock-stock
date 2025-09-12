<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class QuotesPollOnce extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:quotes-poll-once';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Poll quotes for allowed tickers once and print results';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $tickers = explode(',', env('ALLOWED_TICKERS', 'AAPL,MSFT,NVDA,SPY,QQQ,TSLA,AMZN,META,GOOGL,AMD'));
        $service = new \App\Services\QuoteService();
        $quotes = $service->getCurrentQuotes($tickers);
        foreach ($quotes as $quote) {
            $this->info(json_encode($quote));
        }
    }
}
