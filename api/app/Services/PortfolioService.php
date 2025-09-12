<?php

namespace App\Services;

use App\Models\Position;
use App\Models\Symbol;
use App\Services\QuoteService;

class PortfolioService
{
    public function getPortfolio($user)
    {
        $positions = Position::where('user_id', $user->id)->get();
        $tickers = Symbol::whereIn('id', $positions->pluck('symbol_id'))->pluck('ticker')->toArray();
        $quotes = (new QuoteService())->getCurrentQuotes($tickers);
        $quoteMap = collect($quotes)->keyBy('ticker');
        $result = [
            'cash' => $user->cash,
            'positions' => [],
            'equity' => $user->cash,
        ];
        foreach ($positions as $pos) {
            $ticker = Symbol::find($pos->symbol_id)->ticker;
            $mkt_price = $quoteMap[$ticker]['price'] ?? 0;
            $unrealized_pl = ($mkt_price - $pos->avg_cost) * $pos->qty;
            $result['positions'][] = [
                'ticker' => $ticker,
                'qty' => $pos->qty,
                'avg_cost' => $pos->avg_cost,
                'mkt_price' => $mkt_price,
                'unrealized_pl' => $unrealized_pl,
            ];
            $result['equity'] += $pos->qty * $mkt_price;
        }
        return $result;
    }
}
