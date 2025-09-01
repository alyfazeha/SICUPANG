import { API_SURVEYOR_DELETE_DATA_FAMILY } from "@/constants/routes";
import axios from "axios";

export class DeleteFamiliesData {
  public static async delete(id: string | number) {
    try {
      if (!confirm("Apakah Anda yakin ingin menghapus data keluarga ini?")) return;
      return (await axios.delete(API_SURVEYOR_DELETE_DATA_FAMILY(id), { withCredentials: true })).data;
    } catch (err: unknown) {
      console.error(`❌ Error DELETE ${API_SURVEYOR_DELETE_DATA_FAMILY(id)}: ${err}`);
      throw err;
    }
  }
}