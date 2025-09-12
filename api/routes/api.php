<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login']);
Route::post('/register', [\App\Http\Controllers\AuthController::class, 'register']);
Route::get('/symbols', [\App\Http\Controllers\SymbolController::class, 'index']);
Route::get('/quotes', [\App\Http\Controllers\QuoteController::class, 'quotes']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/portfolio', [\App\Http\Controllers\PortfolioController::class, 'show']);
    Route::post('/orders', [\App\Http\Controllers\OrderController::class, 'store']);
    Route::get('/orders', [\App\Http\Controllers\OrderController::class, 'index']);
    Route::get('/trades', [\App\Http\Controllers\TradeController::class, 'index']);
    Route::post('/portfolio/reset', [\App\Http\Controllers\PortfolioController::class, 'reset']);
});
