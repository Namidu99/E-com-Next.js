<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\ProductController;
use App\Http\Controllers\Auth\CustomerController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout'])->middleware('auth:sanctum');


// Public routes (for customer home page)
Route::get('/products/search', [ProductController::class, 'search']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

// Protected routes (for admin with proper middleware)
Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('admin')->middleware(['admin'])->group(function () {
        Route::get('/products', [ProductController::class, 'index']);
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);
        Route::patch('/products/{id}/activate', [ProductController::class, 'activate']);
        Route::patch('/products/{id}/deactivate', [ProductController::class, 'deactivate']);
    });
});


// Customer Authentication Routes (Public)
Route::prefix('customer')->group(function () {
    Route::post('/register', [CustomerController::class, 'register']);
    Route::post('/login', [CustomerController::class, 'login']);
});

// Customer Protected Routes (Requires Authentication)
Route::middleware('auth:sanctum')->prefix('customer')->group(function () {
    Route::get('/profile', [CustomerController::class, 'profile']);
    Route::put('/profile', [CustomerController::class, 'updateProfile']);
    Route::post('/logout', [CustomerController::class, 'logout']);
});

// Default authenticated user route
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});