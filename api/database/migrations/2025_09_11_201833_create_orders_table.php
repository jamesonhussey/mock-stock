<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('symbol_id');
            $table->enum('side', ['buy', 'sell']);
            $table->enum('type', ['market', 'limit']);
            $table->decimal('limit_price', 12, 4)->nullable();
            $table->integer('qty');
            $table->enum('status', ['pending', 'filled', 'cancelled', 'rejected'])->default('pending');
            $table->decimal('avg_fill_price', 12, 4)->nullable();
            $table->timestamp('filled_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
