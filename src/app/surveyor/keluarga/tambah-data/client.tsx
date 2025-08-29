"use client";

import { Home, IdCard, User } from "lucide-react";
import { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa6";
import { AddFamiliesData } from "@/services/add-families-data";
import type { Family } from "@/types/family";
import Input from "@/components/shared/input";
import Radio from "@/components/shared/radio";
import Select from "@/components/shared/select";

export default function Page() {
  const [salary, setSalary] = useState<{ label: string }[]>([]);
  const [villages, setVillages] = useState<{ label: string }[]>([]);
  const [form, setForm] = useState<Omit<Family, "created_at" | "updated_at">>({
    name: "",
    family_card_number: "",
    village: "",
    address: "",
    members: 0,
    income: "",
    spending: "",
    pregnant: false,
    breastfeeding: false,
    toddler: false,
    photo: "",
    foodstuff: [],
  });

  useEffect(() => {
    (async () => {
      const data = await AddFamiliesData.get();
      setSalary(data.salary);
      setVillages(data.villages);
    })();
  }, []);

  return (
    <form onSubmit={() => AddFamiliesData.submit(form)}>
      <section className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Input
          icon={<User className="h-4 w-4" />}
          label="Nama Kepala Keluarga"
          name="nama_kepala_keluarga"
          onChange={(e) => AddFamiliesData.change(e, form, setForm)}
          placeholder="Cth. Agus Miftah"
          required={true}
          type="text"
          variant="form"
        />
        <Input
          icon={<IdCard className="h-4 w-4" />}
          label="Nomor Kartu Keluarga"
          name="nomor_kartu_keluarga"
          onChange={(e) => AddFamiliesData.change(e, form, setForm)}
          placeholder="Cth. 1234567890123456"
          required={true}
          type="number"
          variant="form"
        />
        <Select
          label="Desa"
          name="desa"
          options={villages.map((village) => ({ label: village.label, value: village.label }))}
          required={true}
        />
        <Input
          icon={<Home className="h-4 w-4" />}
          label="Alamat"
          name="alamat"
          onChange={(e) => AddFamiliesData.change(e, form, setForm)}
          placeholder="Cth. Perumahan Meikarta"
          required={true}
          type="text"
          variant="form"
        />
      </section>
      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Input
          icon={<FaUsers className="h-4 w-4" />}
          info="*Termasuk Kepala Keluarga"
          label="Jumlah Anggota"
          name="jumlah_anggota"
          onChange={(e) => AddFamiliesData.change(e, form, setForm)}
          placeholder="Cth. 11"
          required={true}
          type="number"
          variant="form"
        />
        <Select
          label="Pendapatan Keluarga"
          name="pendapatan_keluarga"
          options={salary.map((salary) => ({ label: salary.label, value: salary.label }))}
          required={true}
        />
        <Select
          label="Pengeluaran Keluarga"
          name="pengeluaran_keluarga"
          options={salary.map((salary) => ({ label: salary.label, value: salary.label }))}
          required={true}
        />
        <Radio
          label="Apakah Ada Ibu Hamil?"
          name="hamil"
          options={[{ label: "Ya", value: "Ya" }, { label: "Tidak", value: "Tidak" }]}
          required={true}
        />
        <Radio
          label="Apakah Terdapat Ibu Menyusui?"
          name="menyusui"
          options={[{ label: "Ya", value: "Ya" }, { label: "Tidak", value: "Tidak" }]}
          required={true}
        />
        <Radio
          label="Apakah Terdapat Balita 0 - 6 Tahun?"
          name="balita"
          options={[{ label: "Ya", value: "Ya" }, { label: "Tidak", value: "Tidak" }]}
          required={true}
        />
      </section>
    </form>
  );
}