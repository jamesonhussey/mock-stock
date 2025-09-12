<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('stock_prices', function (Blueprint $table) {
            $table->id();
            $table->string('ticker', 16);
            $table->decimal('price', 12, 4);
            $table->timestamp('recorded_at');
            $table->timestamps();
            $table->index(['ticker', 'recorded_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_prices');
    }
};
