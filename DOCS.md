<h1 align="center">🌾 SICUPANG</h1>
<p align="center">
  <b>Sistem Cerdas untuk Kebutuhan Pangan</b><br>
  Rekomendasi pangan berbasis AI untuk mendukung swasembada pangan Indonesia.
</p>

## 📖 Deskripsi

**SICUPANG** adalah sistem terpadu yang memberikan rekomendasi pangan yang tepat berdasarkan pendapatan dan pengeluaran keluarga, serta membantu pemerintah dalam mewujudkan swasembada pangan.  
Tujuan utama sistem ini adalah:

- Memberikan **rekomendasi pangan** yang tepat berdasarkan **pendapatan** dan **pengeluaran** keluarga.
- Membantu pemerintah, khususnya program Presiden **Prabowo Subianto**, dalam mewujudkan **swasembada pangan**.
- Memantau dan menganalisis pola konsumsi pangan surveyor secara berkelanjutan.

Sistem terdiri dari dua komponen utama:

1. **Laravel** → Menangani antarmuka pengguna, manajemen data, dan fitur admin/surveyor.
2. **FastAPI** → Menyediakan layanan AI untuk rekomendasi pangan berbasis data dan algoritma cerdas.

## 🛠️ Teknologi yang Digunakan

- **Frontend & Backend (Utama):** Laravel 12
- **AI Service:** FastAPI (Python)
- **Database:** MySQL
- **Package Manager:** Composer & Bun
- **Lingkungan:** PHP 8.3+, Python 3.13+

## 🚀 Instalasi

### 1️⃣ Clone Repository

```bash
git clone https://github.com/a6iyyu/sicupang.git
cd sicupang
```

### 2️⃣ Setup Laravel

```bash
# Install dependencies backend
cp .env.example .env
composer install
php artisan key:generate

# Install dependencies frontend
bun install
```

### 3️⃣ Setup FastAPI

```bash
cd python
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8080
```

### 4️⃣ Jalankan Aplikasi

```bash
bun run app
```

- **Laravel** akan berjalan di `http://localhost:8000`
- **FastAPI** akan berjalan di `http://localhost:8080` (atau port yang ditentukan).

## 📌 Catatan

- Pastikan Anda sudah memasang `Laragon` (atau XAMPP) dan `phpMyAdmin` sebelum menjalankan aplikasi.
- Gunakan `.env` pada kedua proyek untuk mengatur konfigurasi.