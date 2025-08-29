import axios from "axios";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { API_SURVEYOR_FAMILY } from "@/constants/routes";
import type { Family, Form } from "@/types/family";

export class AddFamiliesData {
  public static change<T>(e: ChangeEvent<HTMLInputElement>, form: T, setForm: Dispatch<SetStateAction<T>>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  public static async get() {
    try {
      return (await axios.get<Form>(API_SURVEYOR_FAMILY, { withCredentials: true })).data;
    } catch (err: unknown) {
      console.error(`Terjadi kesalahan saat mengambil data yang berkaitan formulir keluarga: ${err}`);
      return { salary: [], villages: [] };
    }
  }

  public static async submit(form: Omit<Family, "created_at" | "updated_at">) {
    try {
      return (await axios.post(API_SURVEYOR_FAMILY, form, { withCredentials: true })).data;
    } catch (err: unknown) {
      console.error(`Terjadi kesalahan saat menyimpan data keluarga: ${err}`);
      throw err;
    }
  }
}