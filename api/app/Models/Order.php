<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    /** @use HasFactory<\Database\Factories\OrderFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'symbol_id',
        'side',
        'type',
        'qty',
        'price',
        'status',
        'avg_fill_price',
        'filled_at',
    ];
}
