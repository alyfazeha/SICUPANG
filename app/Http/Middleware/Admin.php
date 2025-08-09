<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class Admin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check() || Auth::user()->tipe !== 'admin') return to_route('masuk')->withErrors(['error' => 'Anda tidak memiliki izin untuk mengakses halaman ini.']);
        return $next($request);
    }
}