<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SymbolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tickers = explode(',', env('ALLOWED_TICKERS', 'AAPL,MSFT,NVDA,SPY,QQQ,TSLA,AMZN,META,GOOGL,AMD'));
        foreach ($tickers as $ticker) {
            \App\Models\Symbol::firstOrCreate([
                'ticker' => trim($ticker),
            ], [
                'name' => trim($ticker),
            ]);
        }
    }
}
