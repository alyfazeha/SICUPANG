"use client";

import { Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { ADMIN_DASHBOARD, CITIZEN_DASHBOARD } from "@/constants/routes";
import type { Auth } from "@/types/auth";
import type { ValidationErrors } from "@/types/components";
import Link from "next/link";
import Input from "@/components/ui/input";

export default function Masuk() {
  const router = useRouter();
  const [alert, setAlert] = useState<"error" | "success" | null>(null);
  const [errors, setErrors] = useState<Record<keyof typeof form, ValidationErrors[keyof ValidationErrors]>>({ surel: undefined, kata_sandi: undefined });
  const [form, setForm] = useState<Pick<Auth, "surel" | "kata_sandi">>({ surel: "", kata_sandi: "" });
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setInfo("");

    const newErrors: typeof errors = { surel: undefined, kata_sandi: undefined };

    if (!form.surel.trim()) newErrors.surel = { type: "required" };
    if (!form.kata_sandi.trim()) newErrors.kata_sandi = { type: "required" };
    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err !== undefined)) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await res.json()) as { data: Auth };

      if (!res.ok) {
        setAlert("error");
        setInfo("Gagal masuk ke akun Anda.");
        return;
      }

      setAlert("success");
      setInfo("Berhasil masuk ke akun Anda.");
      setTimeout(() => router.push(data.data.peran === "ADMIN" ? ADMIN_DASHBOARD : CITIZEN_DASHBOARD), 800);
    } catch {
      setAlert("error");
      setInfo("Terjadi kesalahan pada server, silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-lg flex-col justify-center">
      <h1 className="mb-3 text-xl font-bold lg:text-3xl">
        Masuk ke <span className="text-primary">SICUPANG</span>
      </h1>
      <p className="mb-8 text-sm lg:text-base">
        Sistem cerdas untuk rekomendasi pangan berbasis AI untuk mendukung
        swasembada pangan Indonesia
      </p>
      {info && (
        <h5 className={`mb-8 rounded-lg p-4 text-center ${alert === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {info}
        </h5>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
        <Input
          errors={errors.surel ? { surel: errors.surel } : {}}
          icon={<Mail className="h-4 w-4" />}
          label="Surel"
          name="surel"
          onChange={handleChange}
          placeholder="Masukkan surel Anda..."
          required={true}
          type="email"
          value={form.surel}
          variant="auth"
        />
        <Input
          errors={errors.kata_sandi ? { kata_sandi: errors.kata_sandi } : {}}
          icon={<Lock className="h-4 w-4" />}
          label="Kata Sandi"
          name="kata_sandi"
          onChange={handleChange}
          placeholder="Masukkan kata sandi Anda..."
          required={true}
          type="password"
          value={form.kata_sandi}
          variant="auth"
        />
        <button
          type="submit"
          className="bg-primary hover:bg-primary/90 mt-2 w-full cursor-pointer rounded-xl py-4 text-sm font-semibold text-white disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Memuat..." : "Masuk"}
        </button>
      </form>
      <p className="mt-8 text-center text-sm">
        Belum punya akun?{" "}
        <Link href="/daftar" className="text-primary font-semibold">
          Daftar di sini
        </Link>
      </p>
    </section>
  );
}