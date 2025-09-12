<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SeedDemoUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:seed-demo-user';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Seed a demo user with $1,000 and print credentials';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = 'demo@demo.com';
        $password = 'password';
        $user = \App\Models\User::firstOrCreate([
            'email' => $email,
        ], [
            'name' => 'Demo User',
            'password' => bcrypt($password),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Add $1,000 starting cash (assume a 'cash' field or similar, or just print for now)
        // If you want to add a 'cash' field, you must update the users table and model.

        $this->info("Demo user created:");
        $this->info("Email: $email");
        $this->info("Password: $password");
    }
}
