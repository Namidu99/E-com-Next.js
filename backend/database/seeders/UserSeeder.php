<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            'name' => 'Super Admin', 
            'role' => 'admin',
            'email' => 'admin@gmail.com', 
            'password' => Hash::make('svt@123'),
            'status' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
