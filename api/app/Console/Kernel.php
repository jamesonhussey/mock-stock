<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Debug: Write to file every time Kernel is loaded
        file_put_contents(base_path('kernel_debug.txt'), 'Kernel loaded at '.date('c')."\n", FILE_APPEND);
        // Schedule the Finnhub price fetcher to run every 2 minutes
        $schedule->command('stocks:finnhub-prices')->everyTwoMinutes();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');
    }
}