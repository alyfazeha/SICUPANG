<?php

declare(strict_types=1);

use App\Http\Controllers\Autentikasi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function (): void {
    Route::get('/masuk', fn() => view('pages.auth.masuk'))->name('masuk');
    Route::post('/masuk', [Autentikasi::class, 'masuk'])->name('autentikasi.masuk');
});

Route::middleware('auth')->group(function () {
    Route::get('/', fn(): RedirectResponse => match (Auth::user()->tipe) {
        'admin'         => to_route('admin.dasbor'),
        'masyarakat'    => to_route('masyarakat.dasbor'),
        default         => to_route('keluar'),
    });

    Route::middleware('admin')->prefix('admin')->group(function (): void {
        Route::get('/', fn() => view('pages.admin.dasbor'))->name('dasbor');
    });

    Route::middleware('masyarakat')->prefix('masyarakat')->group(function (): void {
        Route::get('/', fn() => view('pages.masyarakat.dasbor'))->name('dasbor');
    });

    Route::get('/keluar', [Autentikasi::class, 'keluar'])->name('keluar');
});