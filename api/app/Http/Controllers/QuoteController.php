<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\QuoteService;

class QuoteController extends Controller
{
    public function quotes(Request $request)
    {
        $tickers = $request->query('tickers');
        $tickers = $tickers ? explode(',', $tickers) : [];
        $service = new QuoteService();
        $quotes = $service->getCurrentQuotes($tickers);
        return response()->json($quotes);
    }
}
