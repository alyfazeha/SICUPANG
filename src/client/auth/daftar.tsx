"use client";

import { CheckCheck, IdCard, Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Input from "@/components/ui/input";

export default function Masuk() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [idCard, setIdCard] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    try {
      setInfo("");
      setLoading(true);
    } catch (err: unknown) {
      console.error(`Terjadi kesalahan saat mendaftarkan akun Anda: ${err}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [])

  return (
    <section className="mx-auto flex w-full flex-col justify-center">
      <h1 className="text-text-primary mb-3 cursor-default text-xl font-bold lg:text-3xl">
        Bersama Wujudkan Kemandirian Pangan
      </h1>
      <p className="text-text-secondary mb-8 cursor-default text-sm lg:text-base">
        Bersama SICUPANG, kita bangun Indonesia mandiri pangan dengan teknologi
        cerdas dan dukungan masyarakat.
      </p>
      {info && <h5 className={`mb-6 rounded-lg p-4 text-center`}>{info}</h5>}
      <form action="/api/masuk" method="POST" className="flex flex-col space-y-6">
        <Input
          icon={<Mail className="h-4 w-4" />}
          label="Nama Lengkap"
          name="nama_lengkap"
          onChange={() => setFullName(fullName)}
          placeholder="Masukkan nama lengkap Anda..."
          required={true}
          type="text"
          variant="auth"
        />
        <Input
          icon={<Mail className="h-4 w-4" />}
          label="Surel"
          name="surel"
          onChange={() => setEmail(email)}
          placeholder="Masukkan surel Anda..."
          required={true}
          type="email"
          variant="auth"
        />
        <Input
          icon={<IdCard className="h-4 w-4" />}
          label="NIK (Nomor Induk Kependudukan)"
          name="surel"
          onChange={() => setIdCard(idCard)}
          placeholder="Masukkan NIK Anda..."
          required={true}
          type="number"
          variant="auth"
        />
        <Input
          icon={<Lock className="h-4 w-4" />}
          label="Kata Sandi"
          name="kata_sandi"
          onChange={() => setPassword(password)}
          placeholder="Masukkan kata sandi Anda..."
          required={true}
          type="password"
          variant="auth"
        />
        <Input
          icon={<CheckCheck className="h-4 w-4" />}
          label="Konfirmasi Kata Sandi"
          name="konfirmasi_kata_sandi"
          onChange={() => setPassword(password)}
          placeholder="Konfirmasi kata sandi Anda..."
          required={true}
          type="password"
          variant="auth"
        />
        <button
          type="submit"
          className="bg-primary hover:bg-primary/90 mt-2 w-full cursor-pointer rounded-xl py-4 text-sm font-semibold text-white transition-all duration-300 ease-in-out disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
        >
          <h5>{loading ? "Memuat..." : "Daftar"}</h5>
        </button>
      </form>
      <p className="mt-8 cursor-default text-center text-sm" aria-label="Navigasi ke halaman daftar">
        Sudah punya akun?{" "}
        <Link href="/masuk" className="text-primary hover:text-primary-dark cursor-pointer font-semibold transition-colors">
          Masuk di sini
        </Link>
      </p>
    </section>
  );
}