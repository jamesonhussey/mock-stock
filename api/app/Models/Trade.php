<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Trade extends Model
{
    /** @use HasFactory<\Database\Factories\TradeFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'symbol_id',
        'order_id',
        'qty',
        'side',
        'price',
        'executed_at',
        'ts',
    ];
}
