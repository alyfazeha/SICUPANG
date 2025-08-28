import { Prisma } from "@/lib/prisma";

async function seed() {
  await Prisma.kecamatan.deleteMany();
  await Prisma.kecamatan.createMany({
    data: [
      {
        id_kecamatan: 1,
        kode_wilayah: "35.07.06",
        nama_kecamatan: "Ampelgading",
      },
      {
        id_kecamatan: 2,
        kode_wilayah: "35.07.03",
        nama_kecamatan: "Bantur",
      },
      {
        id_kecamatan: 3,
        kode_wilayah: "35.07.14",
        nama_kecamatan: "Bululawang",
      },
      {
        id_kecamatan: 4,
        kode_wilayah: "35.07.05",
        nama_kecamatan: "Dampit",
      },
      {
        id_kecamatan: 5,
        kode_wilayah: "35.07.22",
        nama_kecamatan: "Dau",
      },
      {
        id_kecamatan: 6,
        kode_wilayah: "35.07.01",
        nama_kecamatan: "Donomulyo",
      },
      {
        id_kecamatan: 7,
        kode_wilayah: "35.07.29",
        nama_kecamatan: "Gedangan",
      },
      {
        id_kecamatan: 8,
        kode_wilayah: "35.07.10",
        nama_kecamatan: "Gondanglegi",
      },
      {
        id_kecamatan: 9,
        kode_wilayah: "35.07.17",
        nama_kecamatan: "Jabung",
      },
      {
        id_kecamatan: 10,
        kode_wilayah: "35.07.11",
        nama_kecamatan: "Kalipare",
      },
      {
        id_kecamatan: 11,
        kode_wilayah: "35.07.23",
        nama_kecamatan: "Karang Ploso"
      },
      {
        id_kecamatan: 12,
        kode_wilayah: "35.07.28",
        nama_kecamatan: "Kasembon",
      },
      {
        id_kecamatan: 13,
        kode_wilayah: "35.07.13",
        nama_kecamatan: "Kepanjen",
      },
      {
        id_kecamatan: 14,
        kode_wilayah: "35.07.31",
        nama_kecamatan: "Kromengan",
      },
      {
        id_kecamatan: 15,
        kode_wilayah: "35.07.25",
        nama_kecamatan: "Lawang",
      },
      {
        id_kecamatan: 16,
        kode_wilayah: "35.07.20",
        nama_kecamatan: "Ngajum",
      },
      {
        id_kecamatan: 17,
        kode_wilayah: "35.07.27",
        nama_kecamatan: "Ngantang",
      },
      {
        id_kecamatan: 18,
        kode_wilayah: "35.07.02",
        nama_kecamatan: "Pagak",
      },
      {
        id_kecamatan: 19,
        kode_wilayah: "35.07.33",
        nama_kecamatan: "Pagelaran",
      },
      {
        id_kecamatan: 20,
        kode_wilayah: "35.07.18",
        nama_kecamatan: "Pakis",
      },
      {
        id_kecamatan: 21,
        kode_wilayah: "35.07.19",
        nama_kecamatan: "Pakisaji",
      },
      {
        id_kecamatan: 22,
        kode_wilayah: "35.07.07",
        nama_kecamatan: "Poncokusumo",
      },
      {
        id_kecamatan: 23,
        kode_wilayah: "35.07.26",
        nama_kecamatan: "Pujon",
      },
      {
        id_kecamatan: 24,
        kode_wilayah: "35.07.24",
        nama_kecamatan: "Singosari",
      },
      {
        id_kecamatan: 25,
        kode_wilayah: "35.07.04",
        nama_kecamatan: "Sumbermanjing Wetan"
      },
      {
        id_kecamatan: 26,
        kode_wilayah: "35.07.12",
        nama_kecamatan: "Sumberpucung",
      },
      {
        id_kecamatan: 27,
        kode_wilayah: "35.07.15",
        nama_kecamatan: "Tajinan",
      },
      {
        id_kecamatan: 28,
        kode_wilayah: "35.07.30",
        nama_kecamatan: "Tirtoyudo",
      },
      {
        id_kecamatan: 29,
        kode_wilayah: "35.07.16",
        nama_kecamatan: "Tumpang",
      },
      {
        id_kecamatan: 30,
        kode_wilayah: "35.07.09",
        nama_kecamatan: "Turen",
      },
      {
        id_kecamatan: 31,
        kode_wilayah: "35.07.21",
        nama_kecamatan: "Wagir",
      },
      {
        id_kecamatan: 32,
        kode_wilayah: "35.07.08",
        nama_kecamatan: "Wajak",
      },
      {
        id_kecamatan: 33,
        kode_wilayah: "35.07.32",
        nama_kecamatan: "Wonosari",
      },
    ],
  });
}

seed()
  .then(() => {
    console.log("✅ Seed data kecamatan selesai.");
  })
  .catch((err: unknown) => {
    console.error(`❌ Terjadi kesalahan saat mengisi data kecamatan: ${err}`);
    process.exit(1);
  });