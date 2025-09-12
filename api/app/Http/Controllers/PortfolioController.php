<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PortfolioService;
use App\Models\User;

class PortfolioController extends Controller
{
    public function show(Request $request)
    {
        $portfolio = (new PortfolioService())->getPortfolio($request->user());
        return response()->json($portfolio);
    }

    public function reset(Request $request)
    {
        $user = $request->user();
    $user->cash = 25000;
        $user->save();
        $user->positions()->delete();
        return response()->json(['message' => 'Portfolio reset.']);
    }
}
