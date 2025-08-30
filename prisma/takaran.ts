import { Prisma } from "@/lib/prisma";

async function seed() {
  await Prisma.takaran.deleteMany();

  const now = new Date();

  await Prisma.takaran.createMany({
    data: [
      { id_takaran: 1, nama_takaran: "Kilogram", created_at: now, updated_at: now },
      { id_takaran: 2, nama_takaran: "Ons", created_at: now, updated_at: now },
      { id_takaran: 3, nama_takaran: "Butir", created_at: now, updated_at: now },
      { id_takaran: 4, nama_takaran: "Liter", created_at: now, updated_at: now },
      { id_takaran: 5, nama_takaran: "Gram", created_at: now, updated_at: now },
      { id_takaran: 6, nama_takaran: "Potong", created_at: now, updated_at: now },
      { id_takaran: 7, nama_takaran: "Buah", created_at: now, updated_at: now },
      { id_takaran: 8, nama_takaran: "Porsi", created_at: now, updated_at: now },
      { id_takaran: 9, nama_takaran: "Galon", created_at: now, updated_at: now },
      { id_takaran: 10, nama_takaran: "Gelas", created_at: now, updated_at: now },
      { id_takaran: 11, nama_takaran: "Mangkok Kecil", created_at: now, updated_at: now },
      { id_takaran: 12, nama_takaran: "Kotak", created_at: now, updated_at: now },
      { id_takaran: 13, nama_takaran: "Kaleng", created_at: now, updated_at: now },
      { id_takaran: 14, nama_takaran: "Bungkus", created_at: now, updated_at: now },
      { id_takaran: 15, nama_takaran: "Kantong Celup", created_at: now, updated_at: now },
      { id_takaran: 16, nama_takaran: "Saset", created_at: now, updated_at: now },
      { id_takaran: 17, nama_takaran: "Botol Kecil", created_at: now, updated_at: now },
    ],
  });
}

seed()
  .then(() => console.log("✅ Seed takaran selesai."))
  .catch((err) => {
    console.error(`❌ Gagal seeding takaran: ${err}`);
    process.exit(1);
  });
