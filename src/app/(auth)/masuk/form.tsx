"use client";

import axios, { type AxiosError } from "axios";
import { Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { ADMIN_DASHBOARD, API_LOGIN, SURVEYOR_DASHBOARD } from "@/constants/routes";
import type { Auth } from "@/types/auth";
import type { ValidationErrors } from "@/types/components";
import Input from "@/components/ui/input";

export default function Form() {
  const router = useRouter();
  const [alert, setAlert] = useState<"error" | "success" | null>(null);
  const [errors, setErrors] = useState<Record<keyof typeof form, ValidationErrors[keyof ValidationErrors]>>({ nip: undefined, kata_sandi: undefined });
  const [form, setForm] = useState<Pick<Auth, "nip" | "kata_sandi">>({ nip: "", kata_sandi: "" });
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setInfo("");

    const newErrors: typeof errors = { nip: undefined, kata_sandi: undefined };

    if (!(form.nip as string).trim()) newErrors.nip = { type: "required" };
    if (!form.kata_sandi.trim()) newErrors.kata_sandi = { type: "required" };
    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err !== undefined)) {
      setLoading(false);
      return;
    }

    try {
      const response = (await axios.post<{ data: Auth }>(API_LOGIN, form)).data;

      setAlert("success");
      setInfo("Berhasil masuk ke akun Anda.");
      setTimeout(() => {
        setInfo("");
        router.push(response.data.peran === "ADMIN" ? ADMIN_DASHBOARD : SURVEYOR_DASHBOARD);
      }, 1200);
    } catch (err: unknown) {
      setAlert("error");
      
      if ((err as AxiosError).response?.status === 401) {
        setInfo("Email atau kata sandi salah.");
      } else {
        setInfo("Terjadi kesalahan pada server, silakan coba lagi.");
      }

      setTimeout(() => setInfo(""), 2000);
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
          errors={errors.nip ? { nip: errors.nip } : {}}
          icon={<Mail className="h-4 w-4" />}
          label="Surel"
          name="nip"
          onChange={handleChange}
          placeholder="Masukkan NIP Anda..."
          required={true}
          type="text"
          value={form.nip as string}
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
      <p className="mt-8 cursor-default text-center text-sm text-gray-500">
        © 2025 Tim Gatranova
        <br />
        Jurusan Teknologi Informasi
        <br />
        Politeknik Negeri Malang
      </p>
    </section>
  );
}