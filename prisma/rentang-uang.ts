import { Prisma } from "@/lib/prisma";

async function seed() {
  await Prisma.rentang_uang.deleteMany();
  await Prisma.rentang_uang.createMany({
    data: [
      {
        id_rentang_uang: 1,
        batas_bawah: "Rp0",
        batas_atas: "Rp1 juta",
      },
      {
        id_rentang_uang: 2,
        batas_bawah: "Rp1 juta",
        batas_atas: "Rp2 juta",
      },
      {
        id_rentang_uang: 3,
        batas_bawah: "Rp2 juta",
        batas_atas: "Rp3 juta",
      },
      {
        id_rentang_uang: 4,
        batas_bawah: "Rp3 juta",
        batas_atas: "Rp4 juta",
      },
      {
        id_rentang_uang: 5,
        batas_bawah: "Rp4 juta",
        batas_atas: "Rp5 juta",
      },
      {
        id_rentang_uang: 6,
        batas_bawah: "Rp5 juta",
        batas_atas: "Rp6 juta",
      },
      {
        id_rentang_uang: 7,
        batas_bawah: "Rp6 juta",
        batas_atas: "Rp7 juta",
      },
      {
        id_rentang_uang: 8,
        batas_bawah: "Rp7 juta",
        batas_atas: "Rp8 juta",
      },
      {
        id_rentang_uang: 9,
        batas_bawah: "Rp8 juta",
        batas_atas: "Rp9 juta",
      },
      {
        id_rentang_uang: 10,
        batas_bawah: "Rp9 juta",
        batas_atas: "Rp10 juta",
      },
      {
        id_rentang_uang: 11,
        batas_bawah: "Rp10 juta",
        batas_atas: "Rp20 juta",
      },
      {
        id_rentang_uang: 12,
        batas_bawah: "Rp20 juta",
        batas_atas: "Rp30 juta",
      },
      {
        id_rentang_uang: 13,
        batas_bawah: "Rp30 juta",
        batas_atas: "Rp40 juta",
      },
      {
        id_rentang_uang: 14,
        batas_bawah: "Rp40 juta",
        batas_atas: "Rp50 juta",
      },
      {
        id_rentang_uang: 15,
        batas_bawah: "Lebih dari",
        batas_atas: "Rp50 juta",
      },
    ],
  });
}

seed()
  .then(() => {
    console.log("✅ Seed data rentang uang selesai.");
  })
  .catch((err: unknown) => {
    console.error(`❌ Terjadi kesalahan saat mengisi data rentang uang: ${err}`);
    process.exit(1);
  });