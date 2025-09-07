import { utils, writeFile } from "xlsx";
import type { FoodData } from "@/types/family";
import type { District as IDistrict } from "@/types/region";

export class District {
  public static downloadExcel(district: IDistrict, foodList: FoodData[]) {
    try {
      const workbook = utils.book_new();
      const header = this.headerSpreadsheet();
      const rows = this.buildRows(foodList);
      const worksheet = utils.aoa_to_sheet([...header, ...rows]);

      worksheet["!merges"] = [
        { s: { r: 0, c: 2 }, e: { r: 0, c: 6 } }, // DBKM SUSENAS
        { s: { r: 0, c: 7 }, e: { r: 0, c: 10 } }, // Rata-rata Konsumsi
      ];

      worksheet["!cols"] = [
        { wch: 5 },
        { wch: 40 },
        { wch: 12 },
        { wch: 14 },
        { wch: 12 },
        { wch: 12 },
        { wch: 16 },
        { wch: 12 },
        { wch: 12 },
        { wch: 10 },
        { wch: 12 },
        { wch: 18 },
        { wch: 18 },
      ];

      rows.forEach((_, index) => {
        ["C", "D", "E", "F", "G", "I"].forEach((column) => {
          const cell = worksheet[`${column}${header.length + index + 1}`];
          if (cell) cell.z = "#,##0.00";
        });

        const totalCell = worksheet[`K${header.length + index + 1}`];
        if (totalCell) totalCell.z = "#,##0.000";
      });

      utils.book_append_sheet(workbook, worksheet, district.name);
      writeFile(workbook, `Data Rekap ${district.name}.xlsx`);
    } catch (err: unknown) {
      console.error(`❌ Error while downloading excel: ${err}`);
      throw err;
    }
  }

  private static buildRows(data: FoodData[]): (string | number)[][] {
    return data.map((item) => ["", item.name, item.weight, item.energy, item.protein, item.fat, item.carbohydrate, item.unit ?? "", 7, item.amount, item.total_family, item.conversion]);
  }

  private static headerSpreadsheet(): string[][] {
    return [
      ["", "Jenis Pangan", "DBKM SUSENAS", "", "", "", "", "Rata-rata Konsumsi per Kapita / Minggu", "", "", "", "Jumlah Keluarga", "Konversi Satuan"],
      ["", "", "Berat (gr)", "Energi (kkal)", "Protein (gr)", "Lemak (gr)", "Karbohidrat (gr)", "Satuan", "Jumlah", "7 Hari", "Total", "", ""],
    ];
  }
}