@extends('layouts.errors')

@section('judul', '404')
@section('deskripsi', 'Oops, halaman yang Anda cari tidak ditemukan!')

@section('konten')
    <main class="min-h-screen flex h-full w-full flex-col items-center justify-center">
        <h1 class="cursor-default font-bold text-3xl">
            404 | Halaman Tidak Ditemukan
        </h1>
    </main>
@endsection