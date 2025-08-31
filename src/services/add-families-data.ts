import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { API_SURVEYOR_ADD_DATA_FAMILY, API_SURVEYOR_FAMILY } from "@/constants/routes";
import type { Family, Foodstuff, Form } from "@/types/family";
import axios from "axios";

export class AddFamiliesData {
  public static addFoodToList<T extends { foodstuff: Foodstuff[] }>(
    foodsList: Foodstuff[],
    form: T,
    setForm: Dispatch<SetStateAction<T>>,
    setFoodsList: Dispatch<SetStateAction<Foodstuff[]>>,
  ) {
    const processed_foods = (document.querySelector("select[name='nama_olahan_pangan']") as HTMLSelectElement)?.value;
    const portion = (document.querySelector("input[name='porsi']") as HTMLInputElement)?.value;

    if (!processed_foods || !portion) return;

    if (foodsList.some((food) => food.name === processed_foods)) {
      alert("Olahan pangan tersebut sudah ditambahkan!");
      return;
    }

    const foodstuff = { name: processed_foods, portion: Number(portion) };
    setForm({ ...form, foodstuff: [...form.foodstuff, foodstuff] });
    setFoodsList([...foodsList, foodstuff]);
  }

  public static change<T>(e: ChangeEvent<HTMLInputElement>, form: T, setForm: Dispatch<SetStateAction<T>>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  public static async get() {
    try {
      return (await axios.get<Form>(API_SURVEYOR_FAMILY, { withCredentials: true })).data;
    } catch (err: unknown) {
      console.error(`Terjadi kesalahan saat mengambil data yang berkaitan formulir keluarga: ${err}`);
      return { processed_foods: [], salary: [], villages: [] };
    }
  }

  public static previewImage(e: ChangeEvent<HTMLInputElement>, setFileSize: Dispatch<SetStateAction<string>>, setPreview: Dispatch<SetStateAction<string | null>>) {
    const file = e.target.files?.[0];

    if (!file) {
      setFileSize("—");
      setPreview(null);
      return;
    }

    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      alert("Hanya file dengan format .jpg, .jpeg, atau .png yang diperbolehkan!");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar tidak boleh lebih dari 5MB!");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = (ev) => {
      setFileSize(Math.floor(file.size / 1024 + 1) + " KB");
      setPreview(ev.target?.result as string);
    };

    reader.readAsDataURL(file);
  }

  public static async submit(form: Omit<Family, "created_at" | "updated_at">) {
    try {
      const response = (await axios.post(API_SURVEYOR_ADD_DATA_FAMILY, form, { withCredentials: true }));
      if (response.status !== 200) throw new Error(`Terjadi kesalahan saat menambahkan data keluarga: ${response.statusText}.`);
      return response.data;
    } catch (err: unknown) {
      console.error(`Server gagal menambahkan data keluarga: ${err}`);
      throw err;
    }
  }
}