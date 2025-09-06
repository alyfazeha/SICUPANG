"use client";

import { CookingPot, Home, IdCard, Send, Trash, Upload, User, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa6";
import { API_SURVEYOR_ADD_DATA_FAMILY, SURVEYOR_FAMILY } from "@/constants/routes";
import { AddFamiliesData, AddFamiliesData as D } from "@/services/family/add/surveyor";
import type { Family, Form as FoodsList, MultiConfirmation } from "@/types/family";
import Link from "next/link";
import Image from "next/image";
import Input from "@/components/shared/input";
import Radio from "@/components/shared/radio";
import Select from "@/components/shared/select";
import Table from "@/components/shared/table";

export default function Page() {
  const router = useRouter();
  const [fileSize, setFileSize] = useState<string>("—");
  const [foodsList, setFoodsList] = useState<{ id: number; name: string; portion: number }[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [processedFoods, setProcessedFoods] = useState<{ id: number; label: string }[]>([]);
  const [salary, setSalary] = useState<{ id: number; label: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [villages, setVillages] = useState<{ id: number; label: string }[]>([]);
  const [form, setForm] = useState<Omit<Family, "id_family" | "created_at" | "updated_at">>({
    id_district: 0,
    id_surveyor: 0,
    name: "",
    family_card_number: "",
    village: 0,
    address: "",
    members: 0,
    income: "",
    spending: "",
    pregnant: null,
    breastfeeding: null,
    toddler: null,
    photo: undefined,
    foodstuff: [],
  });

  useEffect(() => {
    (async () => {
      const data = await AddFamiliesData.get<FoodsList>(API_SURVEYOR_ADD_DATA_FAMILY, { processed_foods: [], salary: [], villages: [] });
      setProcessedFoods(data.processed_foods);
      setSalary(data.salary);
      setVillages(data.villages);
    })();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await D.submit({ ...form, photo: form.photo ?? undefined });
      router.push(SURVEYOR_FAMILY);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <section className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Input
          icon={<User className="h-4 w-4" />}
          label="Nama Kepala Keluarga"
          name="name"
          onChange={(e) => D.change(e, form, setForm)}
          placeholder="Cth. Agus Miftah"
          required={true}
          type="text"
          variant="form"
        />
        <Input
          icon={<IdCard className="h-4 w-4" />}
          label="Nomor Kartu Keluarga"
          name="family_card_number"
          onChange={(e) => D.change(e, form, setForm)}
          placeholder="Cth. 1234567890123456"
          required={true}
          type="number"
          variant="form"
        />
        <Select
          label="Desa"
          name="village"
          onChange={(value) => setForm({ ...form, village: value })}
          options={villages.map((village) => ({ label: village.label, value: village.id.toString() }))}
          required={true}
        />
        <Input
          icon={<Home className="h-4 w-4" />}
          label="Alamat"
          name="address"
          onChange={(e) => D.change(e, form, setForm)}
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
          name="members"
          onChange={(e) => D.change(e, form, setForm)}
          placeholder="Cth. 11"
          required={true}
          type="number"
          variant="form"
        />
        <Select
          label="Pendapatan Keluarga"
          name="income"
          onChange={(value) => setForm({ ...form, income: value })}
          options={salary.map((salary) => ({ label: salary.label, value: salary.id.toString() }))}
          required={true}
        />
        <Select
          label="Pengeluaran Keluarga"
          name="spending"
          onChange={(value) => setForm({ ...form, spending: value })}
          options={salary.map((salary) => ({ label: salary.label, value: salary.id.toString() }))}
          required={true}
        />
        <Radio
          label="Apakah Ada Ibu Hamil?"
          name="pregnant"
          onChange={(value) => setForm({ ...form, pregnant: value as typeof form.pregnant })}
          options={[ { label: "Ya", value: "Ya" }, { label: "Tidak", value: "Tidak" } ]}
          required={true}
          value={form.pregnant as MultiConfirmation}
        />
        <Radio
          label="Apakah Terdapat Ibu Menyusui?"
          name="breastfeeding"
          onChange={(value) => setForm({ ...form, breastfeeding: value as typeof form.breastfeeding })}
          options={[ { label: "Ya", value: "Ya" }, { label: "Tidak", value: "Tidak" } ]}
          required={true}
          value={form.breastfeeding as MultiConfirmation}
        />
        <Radio
          label="Apakah Terdapat Balita 0 - 6 Tahun?"
          name="toddler"
          onChange={(value) => setForm({ ...form, toddler: value as typeof form.toddler })}
          options={[ { label: "Ya", value: "Ya" }, { label: "Tidak", value: "Tidak" } ]}
          required={true}
          value={form.toddler as MultiConfirmation}
        />
      </section>
      <section className="flex flex-col">
        <h3 className="my-6 cursor-default text-sm font-medium">
          Dokumentasi Kegiatan <span className="text-red-500">*</span>
        </h3>
        <fieldset>
          {!preview ? (
            <label htmlFor="photo" className="focus:border-primary flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-[#d1d5db] p-20">
              <Upload className="h-8 w-8 text-slate-800" />
              <span className="mt-2 text-sm font-medium text-slate-800">
                Pilih Gambar
              </span>
            </label>
          ) : (
            <section className="focus:border-primary rounded-lg border-2 border-[#d1d5db] p-4">
              <Image height={1920} width={1080} src={preview} alt="Dokumentasi Kegiatan" className="h-100 w-full rounded-lg object-cover" />
            </section>
          )}
          <input
            name="photo"
            id="photo"
            type="file"
            accept="image/jpeg, image/jpg, image/png"
            className="hidden"
            onChange={(e) => { D.previewImage(e, setFileSize, setPreview); if (e.target.files && e.target.files[0]) setForm({ ...form, photo: e.target.files[0] });  }}
          />
        </fieldset>
        <h6 className="mt-2 cursor-default text-sm text-slate-800 italic">
          *Format gambar yang diperbolehkan: .jpg, .jpeg, .png
        </h6>
        <h6 className="cursor-default text-sm text-slate-800 italic">
          Ukuran gambar yang diunggah: <span>{fileSize}</span> dari 5120 KB.
        </h6>
      </section>
      <section className="mt-6 flex flex-col gap-6 lg:flex-row">
        <Select
          label="Nama Olahan Pangan"
          name="id_foods"
          options={processedFoods.map((foods) => ({ label: foods.label, value: foods.id.toString() }))}
          required={false}
        />
        <Input
          icon={<CookingPot className="h-4 w-4" />}
          label="Porsi"
          name="portion"
          onChange={(e) => D.change(e, form, setForm)}
          placeholder="Cth. 11"
          required={false}
          type="number"
          variant="form"
        />
        <button
          type="button"
          onClick={() => D.addFoodToList(foodsList, form, setForm, setFoodsList)}
          className="bg-primary duratio-300 hover:bg-primary/80 mt-auto cursor-pointer self-center rounded-lg px-10 py-4 text-sm text-white transition-all ease-in-out"
        >
          Tambah
        </button>
      </section>
      <section className="mt-6">
        <Table
          headers={["Nama Olahan Pangan", "Porsi", "Aksi"]}
          rows={foodsList.map((food, index) => [
            food.name,
            food.portion.toString() + " Porsi",
            <button
              key={index}
              type="button"
              className="cursor-pointer flex items-center justify-center px-5 py-3 bg-red-500 text-white rounded-lg transition-colors duration-150 shadow-sm hover:bg-red-600 text-xs"
              onClick={() => { setFoodsList(foodsList.filter((_, i) => i !== index)); setForm({ ...form, foodstuff: foodsList.filter((_, i) => i !== index) }) }}
            >
              <Trash className="mr-2 h-3.5 w-3.5" /> Hapus
            </button>,
          ])}
          sortable={["Nama Olahan Pangan"]}
        />
      </section>
      <span className="mt-6 flex items-center justify-end gap-2">
        <Link href={SURVEYOR_FAMILY} className="flex items-center rounded-lg bg-red-500 px-5 py-3 text-sm text-white transition-colors duration-300 hover:bg-red-600">
          <X className="mr-2 h-4 w-4 text-white" />
          <h5 className="text-sm font-medium text-white">Batal</h5>
        </Link>
        <button disabled={submitting} type="submit" className="bg-primary hover:bg-primary/80 flex cursor-pointer items-center rounded-lg px-5 py-3 text-sm text-white transition-colors duration-300">
          <Send className="mr-2 h-4 w-4 text-white" />
          <h5 className="text-sm font-medium text-white">Simpan</h5>
        </button>
      </span>
    </form>
  );
}