import axios from "axios";
import { API_SURVEYOR_EDIT_DATA_FAMILY } from "@/constants/routes";

export class EditFamiliesData {
  public static async submit() {
    try {
      const response = (await axios.patch(API_SURVEYOR_EDIT_DATA_FAMILY, null, { withCredentials: true }));
      if (response.status !== 200) throw new Error(`Terjadi kesalahan saat mengedit data keluarga: ${response.statusText}.`);
      return response.data;
    } catch (err: unknown) {
      console.error(`Server gagal mengedit data keluarga: ${err}`);
      throw err;
    }
  }
}