import { utils, writeFile } from "xlsx";
import type { District as IDistrict } from "@/types/region";

class FoodRecord {
  public static downloadExcel(district: IDistrict, foodList: { nama_pangan: string; urt: number; takaran: string }[]) {
    try {
      const workbook = utils.book_new();
      const header = this.headerSpreadsheet();
      const rows = this.buildRows(foodList);
      const worksheet = utils.aoa_to_sheet([...header, ...rows]);

      worksheet["!cols"] = [
        { wch: 5 },
        { wch: 40 },
        { wch: 12 },
        { wch: 20 },
      ];

      utils.book_append_sheet(workbook, worksheet, district.name);
      writeFile(workbook, `Data Pangan ${district.name}.xlsx`);
    } catch (err: unknown) {
      console.error(`❌ Error while downloading excel: ${err}`);
      throw err;
    }
  }

  private static buildRows(data: { nama_pangan: string; urt: number; takaran: string }[]): (string | number)[][] {
    return data.map((item, index) => [
      index + 1,
      item.nama_pangan,
      item.urt,
      item.takaran,
    ]);
  }

  private static headerSpreadsheet(): string[][] {
    return [["", "Nama Pangan", "URT", "Takaran"]];
  }
}

export const DownloadExcel = FoodRecord.downloadExcel;
export { FoodRecord };