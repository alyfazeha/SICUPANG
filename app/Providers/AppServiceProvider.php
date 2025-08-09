<?php

declare(strict_types=1);

namespace App\Providers;

use App\Http\Middleware\Admin;
use App\Http\Middleware\Masyarakat;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void {}

    /**
     * Bootstrap any application services.
     */
    public function boot(): void {
        Route::aliasMiddleware('admin', Admin::class);
        Route::aliasMiddleware('masyarakat', Masyarakat::class);
    }
}