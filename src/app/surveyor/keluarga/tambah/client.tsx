"use client";

import { CookingPot, Home, IdCard, Trash, Upload, User } from "lucide-react";
import { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa6";
import { AddFamiliesData } from "@/services/add-families-data";
import type { Family } from "@/types/family";
import Image from "next/image";
import Input from "@/components/shared/input";
import Radio from "@/components/shared/radio";
import Select from "@/components/shared/select";
import Table from "@/components/shared/table";

export default function Page() {
  const [fileSize, setFileSize] = useState<string>("—");
  const [foodsList, setFoodsList] = useState<{ name: string; portion: number }[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [processedFoods, setProcessedFoods] = useState<{ label: string }[]>([]);
  const [salary, setSalary] = useState<{ label: string }[]>([]);
  const [villages, setVillages] = useState<{ label: string }[]>([]);
  const [form, setForm] = useState<Omit<Family, "created_at" | "updated_at">>({
    id_district: 0,
    id_surveyor: 0,
    name: "",
    family_card_number: "",
    village: "",
    address: "",
    members: 0,
    income: "",
    spending: "",
    pregnant: "TIDAK",
    breastfeeding: "TIDAK",
    toddler: "TIDAK",
    photo: "",
    foodstuff: [],
  });

  useEffect(() => {
    (async () => {
      const data = await AddFamiliesData.get();
      setProcessedFoods(data.processed_foods);
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
          options={[ { label: "Ya", value: "Ya" }, { label: "Tidak", value: "Tidak" } ]}
          required={true}
        />
        <Radio
          label="Apakah Terdapat Ibu Menyusui?"
          name="menyusui"
          options={[ { label: "Ya", value: "Ya" }, { label: "Tidak", value: "Tidak" } ]}
          required={true}
        />
        <Radio
          label="Apakah Terdapat Balita 0 - 6 Tahun?"
          name="balita"
          options={[ { label: "Ya", value: "Ya" }, { label: "Tidak", value: "Tidak" } ]}
          required={true}
        />
      </section>
      <section className="flex flex-col">
        <h3 className="my-6 cursor-default text-sm font-medium">
          Dokumentasi Kegiatan <span className="text-red-500">*</span>
        </h3>
        <fieldset>
          {!preview ? (
            <label htmlFor="gambar" className="focus:border-primary flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-[#d1d5db] p-20">
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
          <input name="gambar" id="gambar" type="file" accept="image/jpeg, image/jpg, image/png" className="hidden" onChange={(e) => AddFamiliesData.previewImage(e, setFileSize, setPreview)} />
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
          name="nama_olahan_pangan"
          options={processedFoods.map((foods) => ({ label: foods.label, value: foods.label }))}
          required={true}
        />
        <Input
          icon={<CookingPot className="h-4 w-4" />}
          label="Porsi"
          name="porsi"
          onChange={(e) => AddFamiliesData.change(e, form, setForm)}
          placeholder="Cth. 11"
          required={true}
          type="number"
          variant="form"
        />
        <button
          type="button"
          onClick={() => AddFamiliesData.addFoodToList(foodsList, form, setForm, setFoodsList)}
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
            food.portion.toString(),
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
    </form>
  );
}