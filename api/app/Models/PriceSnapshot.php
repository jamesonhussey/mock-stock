<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PriceSnapshot extends Model
{
    /** @use HasFactory<\Database\Factories\PriceSnapshotFactory> */
    use HasFactory;

    protected $fillable = [
        'symbol_id',
        'ts',
        'price',
    ];
    // Add relationship to Symbol
    public function symbol()
    {
        return $this->belongsTo(Symbol::class);
    }
}
