<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Trade;
use App\Models\Position;
use App\Models\User;
use App\Models\Symbol;
use Illuminate\Support\Facades\DB;
use App\Services\QuoteService;

class OrderService
{
    public function placeMarketOrder(User $user, $ticker, $qty, $side)
    {
        return DB::transaction(function () use ($user, $ticker, $qty, $side) {
            $symbol = Symbol::where('ticker', $ticker)->firstOrFail();
            $quote = (new QuoteService())->getCurrentQuotes([$ticker])[0];
            $price = $quote['price'] ?? null;
            if ($price === null) {
                throw new \Exception('No price available for ' . $ticker);
            }
            $position = Position::firstOrNew([
                'user_id' => $user->id,
                'symbol_id' => $symbol->id,
            ]);
            $isNew = !$position->exists;
            if ($isNew) {
                $position->qty = 0;
                $position->avg_cost = 0;
            }
            if ($side === 'BUY') {
                $cost = $qty * $price;
                if ($user->cash < $cost) {
                    throw new \Exception('Insufficient cash');
                }
                $user->cash -= $cost;
                $position->qty += $qty;
                $position->avg_cost = $price; // Always set for BUY
            } else {
                if ($position->qty < $qty) {
                    throw new \Exception('Insufficient shares');
                }
                $user->cash += $qty * $price;
                $position->qty -= $qty;
                // For sell, avg_cost remains unchanged, but must be set for new positions
                if ($isNew) {
                    $position->avg_cost = 0;
                }
            }
            // Ensure avg_cost is always set before save
            if (!isset($position->avg_cost)) {
                $position->avg_cost = 0;
            }
            $user->save();
            $position->save();
            $order = Order::create([
                'user_id' => $user->id,
                'symbol_id' => $symbol->id,
                'side' => strtolower($side),
                'type' => strtolower('MARKET'),
                'qty' => $qty,
                'status' => 'filled',
                'avg_fill_price' => $price,
                'filled_at' => now(),
            ]);
            $trade = Trade::create([
                'user_id' => $user->id,
                'symbol_id' => $symbol->id,
                'order_id' => $order->id,
                'qty' => $qty,
                'side' => strtolower($side),
                'price' => $price,
                'ts' => now(),
            ]);
            return $order;
        });
    }
}
