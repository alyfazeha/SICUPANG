import { expect, test } from "playwright/test";
import { LOGIN, SURVEYOR_ADD_DATA_FAMILY, SURVEYOR_FAMILY } from "@/constants/routes";

test.describe("E2E: Alur Tambah Data Keluarga", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN);
    await page.getByPlaceholder("Masukkan NIP Anda...").fill("198409212017062001");
    await page.getByPlaceholder("Masukkan kata sandi Anda...").fill("21091984");
    await page.getByRole("button", { name: /Masuk/i }).click();
    await page.goto(SURVEYOR_ADD_DATA_FAMILY);
  });

  /** Tes Positif */
  test("should create family data with valid inputs", async ({ page }) => {
    await page.getByPlaceholder("Cth. Agus Miftah").fill("Budi Santoso");
    await page.getByLabel("Nomor Kartu Keluarga").fill("3501234567890001");
    await page.getByLabel("Desa").click();
    await page.getByRole("option", { name: /Saptorenggo/i }).click();
    await page.getByLabel("Alamat").fill("Jl. Merdeka No. 123");
    await page.getByLabel("Jumlah Anggota").fill("4");
    await page.getByLabel("Pendapatan Keluarga").click();
    await page.getByRole("option", { name: "Rp 2.000.000 - Rp 3.000.000" }).click();
    await page.getByLabel("Pengeluaran Keluarga").click();
    await page.getByRole("option", { name: "Rp 1.000.000 - Rp 2.000.000" }).click();
    await page.getByLabel("Apakah Ada Ibu Hamil?").getByText("Ya").click();
    await page.getByLabel("Apakah Terdapat Ibu Menyusui?").getByText("Tidak").click();
    await page.getByLabel("Apakah Terdapat Balita 0 - 6 Tahun?").getByText("Ya").click();
    await page.getByLabel("Pilih Gambar").setInputFiles("tests/assets/sample.jpg");
    await expect(page.getByAltText("Dokumentasi Kegiatan")).toBeVisible();
    await page.getByLabel("Nama Olahan Pangan").fill("Nasi Goreng");
    await page.getByLabel("Porsi").fill("2");
    await page.getByRole("button", { name: "Tambah" }).click();
    await expect(page.getByRole("cell", { name: "Nasi Goreng" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "2 Porsi" })).toBeVisible();
    await page.getByRole("button", { name: "Simpan" }).click();
    await expect(page).toHaveURL(SURVEYOR_FAMILY);
    await expect(page.getByRole("cell", { name: "Budi Santoso" })).toBeVisible();
  });

  /** Tes Negatif */
  test("should not create family data with empty inputs", async ({ page }) => {
    await page.getByRole("button", { name: "Simpan" }).click();
    expect(await page.getByLabel("Nama Kepala Keluarga").evaluate((element) => (element as HTMLInputElement).validationMessage)).not.toBe("");
    await expect(page).toHaveURL(SURVEYOR_ADD_DATA_FAMILY);
  });
});