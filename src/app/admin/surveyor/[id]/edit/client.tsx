"use client";

import { IdCard, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { ADMIN_MANAGE_SURVEYORS, API_ADMIN_MANAGE_SURVEYOR } from "@/constants/routes";
import { Surveyor } from "@/types/surveyor";
import axios from "axios";
import Input from "@/components/shared/input";
import Select from "@/components/shared/select";

export default function Page({ districts, params, surveyor }: { districts: { id: number; name: string }[]; params: Promise<{ id: string }>; surveyor: Surveyor }) {
  const router = useRouter();
  
  const [form, setForm] = useState<Surveyor>({
    district: surveyor.district,
    full_name: surveyor.full_name,
    nip: surveyor.nip,
    password: surveyor.password,
    phone_number: surveyor.phone_number,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await axios.patch(API_ADMIN_MANAGE_SURVEYOR((await params).id), form);
    router.push(ADMIN_MANAGE_SURVEYORS);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Input
          label="Nama Lengkap"
          name="nama_lengkap"
          type="text"
          value={form.full_name}
          icon={<User className="h-4 w-4" />}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          required
          variant="form"
        />
        <Input
          label="NIP"
          name="nip"
          type="number"
          value={form.nip}
          icon={<IdCard className="h-4 w-4" />}
          onChange={(e) => setForm({ ...form, nip: e.target.value })}
          required
          variant="form"
        />
        <Input
          label="Nomor Telepon"
          name="nomor_telepon"
          type="number"
          value={form.phone_number}
          icon={<IdCard className="h-4 w-4" />}
          onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
          required
          variant="form"
        />
        <Select
          label="Kecamatan"
          name="kecamatan"
          options={districts.map((district) => ({ label: district.name, value: district.id.toString() }))}
          value={form?.district?.id?.toString()}
          required
          onChange={(newValue) => (districts.find((district) => district.id.toString() === newValue)) && setForm({ ...form, district: districts.find((district) => district.id.toString() === newValue)! }) }
        />
        <span className="col-span-2">
          <Input
            label="Kata Sandi"
            name="kata_sandi"
            placeholder="Kosongkan jika tidak ingin mengubah kata sandi"
            type="password"
            icon={<IdCard className="h-4 w-4" />}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required={false}
            variant="form"
          />
        </span>
      </div>
      <span className="mt-12 flex items-center justify-end">
        <button type="submit" className="bg-primary hover:bg-primary/80 focus:ring-primary inline-flex cursor-pointer items-center rounded-md px-5 py-3 text-sm font-medium text-white transition-all duration-300 ease-in-out focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50">
          Simpan Perubahan
        </button>
      </span>
    </form>
  );
}