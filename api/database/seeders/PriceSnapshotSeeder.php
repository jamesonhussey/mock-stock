<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PriceSnapshotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $symbol = \App\Models\Symbol::where('ticker', 'AAPL')->first();
        if ($symbol) {
            \App\Models\PriceSnapshot::create([
                'symbol_id' => $symbol->id,
                'ts' => now(),
                'price' => 175.00,
            ]);
        }
    }
}
