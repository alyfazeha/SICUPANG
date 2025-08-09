<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class Masyarakat
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check() || Auth::user()->tipe !== 'masyarakat') return to_route('masuk')->withErrors(['error' => 'Anda tidak memiliki izin untuk mengakses halaman ini.']);
        return $next($request);
    }
}