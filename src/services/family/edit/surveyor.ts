import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { API_SURVEYOR_EDIT_DATA_FAMILY } from "@/constants/routes";
import type { Family, Foodstuff } from "@/types/family";
import { Form as BaseForm } from "@/utils/form";
import axios from "axios";

class EditFamiliesData extends BaseForm {
  constructor() {
    super();
  }

  public static addFoodToList<T extends { foodstuff: Foodstuff[]; id_foods?: string; portion?: number }>(
    foodsList: Foodstuff[],
    form: T,
    setForm: Dispatch<SetStateAction<T>>,
    setFoodsList: Dispatch<SetStateAction<Foodstuff[]>>,
  ) {
    const name = form.id_foods?.trim();
    const portion = form.portion ?? 0;

    if (!name || !portion) {
      alert("Nama olahan pangan dan porsi wajib diisi!");
      return;
    }

    if (foodsList.some((food) => food.name.toLowerCase() === name.toLowerCase())) {
      alert("Olahan pangan tersebut sudah ditambahkan!");
      return;
    }

    const foodstuff: Foodstuff = { id: Date.now(), name, portion };
    setForm({ ...form, foodstuff: [...form.foodstuff, foodstuff], id_foods: "", portion: undefined });
    setFoodsList([...foodsList, foodstuff]);
  }

  public static mappingFoods<T>(family: Omit<Family, "created_at" | "updated_at">, setForm: Dispatch<SetStateAction<T>>, setFoodsList: Dispatch<SetStateAction<Foodstuff[]>>) {
    if (!family.foodstuff || family.foodstuff.length === 0) return setFoodsList([] as Foodstuff[]);
    setForm((prev) => ({ ...prev, foodstuff: family.foodstuff }));
    setFoodsList(family.foodstuff);
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

  public static async submit(form: Omit<Family, "id_family" | "created_at" | "updated_at"> & { photo?: string | File }, id: string | number) {
    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (!(value !== undefined && value !== null)) return;
        formData.append(key, key === "foodstuff" ? JSON.stringify(value) : (value as string | Blob));
      });

      if (form.photo) {
        formData.append("photo", form.photo);
      }

      const response = await axios.patch(API_SURVEYOR_EDIT_DATA_FAMILY(id), formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status !== 200) {
        throw new Error(`Terjadi kesalahan saat menambahkan data keluarga: ${response.statusText}.`);
      }

      return response.data;
    } catch (err: unknown) {
      console.error(`❌ Error POST ${API_SURVEYOR_EDIT_DATA_FAMILY(id)}: ${err}`);
      throw err;
    }
  }
}

export const AddFoodToList = EditFamiliesData.addFoodToList;
export const MappingFoods = EditFamiliesData.mappingFoods;
export const PreviewImage = EditFamiliesData.previewImage;
export const Submit = EditFamiliesData.submit;
export { EditFamiliesData };