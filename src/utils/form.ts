import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import axios from "axios";

class Form {
  public static change<T>(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, form: T, setForm: Dispatch<SetStateAction<T>>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  public static async get<T>(route: string, fallback: T): Promise<T> {
    try {
      return (await axios.get<T>(route, { withCredentials: true })).data;
    } catch (err: unknown) {
      console.error(`❌ Terjadi kesalahan saat mengambil data: ${err}`);
      return fallback;
    }
  }
}

export const Change = Form.change;
export const Get = Form.get;
export { Form };