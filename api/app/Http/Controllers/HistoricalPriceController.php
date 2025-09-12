<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StockPrice;

class HistoricalPriceController extends Controller
{
    public function show($ticker, Request $request)
    {
        $query = StockPrice::where('ticker', $ticker)->orderBy('recorded_at');
        // Optional: filter by range if provided
        if ($request->has('start')) {
            $query->where('recorded_at', '>=', $request->input('start'));
        }
        if ($request->has('end')) {
            $query->where('recorded_at', '<=', $request->input('end'));
        }
        $prices = $query->get(['recorded_at', 'price']);
        return response()->json($prices);
    }
}
