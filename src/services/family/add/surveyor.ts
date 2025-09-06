import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { API_SURVEYOR_ADD_DATA_FAMILY } from "@/constants/routes";
import type { Family, Foodstuff } from "@/types/family";
import { Form as BaseForm } from "@/services/superclass/form";
import axios from "axios";

export class AddFamiliesData extends BaseForm {
  constructor() {
    super();
  }

  public static addFoodToList<T extends { foodstuff: Foodstuff[] }>(
    foodsList: Foodstuff[],
    form: T,
    setForm: Dispatch<SetStateAction<T>>,
    setFoodsList: Dispatch<SetStateAction<Foodstuff[]>>,
  ) {
    const element = document.querySelector("select[name='id_foods']") as HTMLSelectElement;
    const portion = Number((document.querySelector("input[name='portion']") as HTMLInputElement)?.value);

    if (element || portion) {
      (document.querySelector("span[class='truncate']") as HTMLSelectElement).textContent = "";
      (document.querySelector("input[name='portion']") as HTMLInputElement).value = "";
    }

    if (!Number(element?.value) || !portion) return;

    if (foodsList.some((food) => food.id === Number(element?.value))) {
      alert("Olahan pangan tersebut sudah ditambahkan!");
      return;
    }

    const foodstuff: Foodstuff = { id: Number(element?.value), name: element?.selectedOptions[0]?.text ?? "", portion: portion };

    setForm({ ...form, foodstuff: [...form.foodstuff, foodstuff], id_foods: "", portion: "" });
    setFoodsList([...foodsList, foodstuff]);
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

  public static async submit(form: Omit<Family, "id_family" | "created_at" | "updated_at">) {
    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (!(value !== undefined && value !== null)) return;
        formData.append(key, key === "foodstuff" ? JSON.stringify(value) : (value as string | Blob));
      });

      if (form.photo) {
        formData.append("photo", form.photo);
      }

      const response = await axios.post(API_SURVEYOR_ADD_DATA_FAMILY, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status !== 200) {
        throw new Error(`Terjadi kesalahan saat menambahkan data keluarga: ${response.statusText}.`);
      }

      return response.data;
    } catch (err: unknown) {
      console.error(`❌ Error POST ${API_SURVEYOR_ADD_DATA_FAMILY}: ${err}`);
      throw err;
    }
  }
}