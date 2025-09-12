<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Trade;
use Illuminate\Support\Facades\DB;

class TradeController extends Controller
{
    public function index(Request $request)
    {
    $trades = DB::table('trades')
            ->join('symbols', 'trades.symbol_id', '=', 'symbols.id')
            ->where('trades.user_id', $request->user()->id)
            ->orderByDesc('trades.created_at')
            ->select(
                'trades.id',
                'symbols.ticker as ticker',
                'trades.qty',
                'trades.side',
                'trades.price',
                'trades.created_at'
            )
            ->get();
        return response()->json($trades);
    }
}
