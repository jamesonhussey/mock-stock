<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\OrderService;
use App\Models\Order;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'ticker' => 'required|string',
            'side' => 'required|in:BUY,SELL',
            'type' => 'required|in:MARKET',
            'qty' => 'required|integer|min:1',
        ]);
        $order = (new OrderService())->placeMarketOrder($request->user(), $request->ticker, $request->qty, $request->side);
        return response()->json($order);
    }

    public function index(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)->orderByDesc('created_at')->get();
        return response()->json($orders);
    }
}
