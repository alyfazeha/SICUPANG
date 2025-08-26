import { hashSync } from "bcryptjs";
import { Prisma } from "@/lib/prisma";

async function seed() {
  await Prisma.pengguna.deleteMany();
  await Prisma.pengguna.createMany({
    data: [
      {
        id_pengguna: 1,
        nama_lengkap: "Administrator",
        surel: "admin@sicupang.com",
        kata_sandi: hashSync("admin123", 10),
        peran: "ADMIN",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id_pengguna: 2,
        nama_lengkap: "Surveyor",
        surel: "surveyor@sicupang.com",
        kata_sandi: hashSync("surveyor123", 10),
        peran: "SURVEYOR",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
  });
}

seed()
  .then(() => console.log("✅ Seed data pengguna selesai."))
  .catch((err: unknown) => {
    console.error(`❌ Terjadi kesalahan saat mengisi data pengguna: ${err}`);
    process.exit(1);
  })
  .finally(async () => await Prisma.$disconnect());