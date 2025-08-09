<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Pengguna;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\ValidationException;

class Autentikasi extends Controller
{
    public function masuk(Request $request): RedirectResponse
    {
        try {
            $request->validate([
                'surel'         => 'required|email|exists:users,email',
                'kata_sandi'    => 'required|min:7|confirmed|string',
            ]);

            $pengguna = Pengguna::where('surel', $request->surel)->first();

            if (!$pengguna) {
                Log::warning('Upaya masuk gagal dilakukan: ', ['surel' => $request->surel]);
                return back()->withErrors(['errors' => 'Surel atau kata sandi salah.'])->withInput($request->except('kata_sandi'));
            }

            if ($request->kata_sandi !== Crypt::decrypt($pengguna->kata_sandi)) {
                Log::warning('Upaya masuk gagal dilakukan: ', ['surel' => $request->surel]);
                return back()->withErrors(['errors' => 'Surel atau kata sandi salah.'])->withInput($request->except('kata_sandi'));
            }

            Auth::login($pengguna);
            Session::put([
                'id_pengguna'   => $pengguna->id_pengguna,
                'surel'         => $pengguna->surel,
                'tipe'          => $pengguna->tipe,
            ]);

            switch ($pengguna->tipe) {
                case 'ADMIN':
                    $admin = $pengguna->admin;
                    Session::put(['id_admin' => $admin->id_admin, 'nip' => $admin->nip, 'nama_admin' => $admin->nama]);
                    return to_route('admin.dasbor');
                case 'MASYARAKAT':
                    $masyarakat = $pengguna->masyarakat;
                    Session::put(['id_masyarakat' => $masyarakat->id_masyarakat, 'nik' => $masyarakat->nik, 'nama_lengkap' => $masyarakat->nama_lengkap]);
                    return to_route('masyarakat.dasbor');
                default:
                    return back()->withErrors(['errors' => 'Tipe pengguna tidak valid.'])->withInput($request->except('kata_sandi'));
            }
        } catch (ValidationException $exception) {
            return back()->withErrors($exception->errors())->withInput($request->except('kata_sandi'));
        } catch (Exception $exception) {
            report($exception);
            Log::error("Terjadi kesalahan saat masuk ke akun Anda: " . $exception->getMessage());
            return back()->withErrors(['error' => 'Terjadi kesalahan saat masuk ke akun Anda. Silakan coba lagi.']);
        }
    }

    public function keluar(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }
}