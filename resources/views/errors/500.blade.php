@extends('layouts.errors')

@section('judul', '500')
@section('deskripsi', 'Oops, terdapat kesalahan server internal!')

@section('konten')
    <main class="min-h-screen flex h-full w-full flex-col items-center justify-center">
        <h1 class="cursor-default font-bold text-3xl">
            500 | Kesalahan Server Internal
        </h1>
    </main>
@endsection