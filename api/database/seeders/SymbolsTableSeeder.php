<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SymbolsTableSeeder extends Seeder
{
    public function run(): void
    {
        $symbols = [
            ['ticker' => 'AAPL', 'name' => 'Apple Inc.'],
            ['ticker' => 'MSFT', 'name' => 'Microsoft Corp.'],
            ['ticker' => 'AMZN', 'name' => 'Amazon.com Inc.'],
            ['ticker' => 'GOOGL', 'name' => 'Alphabet Inc.'],
            ['ticker' => 'META', 'name' => 'Meta Platforms'],
            ['ticker' => 'TSLA', 'name' => 'Tesla Inc.'],
            ['ticker' => 'NVDA', 'name' => 'NVIDIA Corp.'],
            ['ticker' => 'BRK-A', 'name' => 'Berkshire Hathaway'],
            ['ticker' => 'V', 'name' => 'Visa Inc.'],
            ['ticker' => 'JPM', 'name' => 'JPMorgan Chase'],
        ];
        DB::table('symbols')->insert($symbols);
    }
}
