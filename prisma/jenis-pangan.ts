import { Prisma } from "@/lib/prisma";

async function seed() {
  await Prisma.jenis_pangan.createMany({
    data: [
      {
        id_jenis_pangan: 1,
        nama_jenis: "Padi-Padian",
        bobot_jenis: 0.5,
        skor_maksimal_jenis: 25,
      },
      {
        id_jenis_pangan: 2,
        nama_jenis: "Umbi-Umbian",
        bobot_jenis: 0.5,
        skor_maksimal_jenis: 2.5,
      },
      {
        id_jenis_pangan: 3,
        nama_jenis: "Ikan",
        bobot_jenis: 0,
        skor_maksimal_jenis: 0,
      },
      {
        id_jenis_pangan: 4,
        nama_jenis: "Daging",
        bobot_jenis: 0,
        skor_maksimal_jenis: 0,
      },
      {
        id_jenis_pangan: 5,
        nama_jenis: "Telur dan Susu",
        bobot_jenis: 0,
        skor_maksimal_jenis: 0,
      },
      {
        id_jenis_pangan: 6,
        nama_jenis: "Sayur-Sayuran",
        bobot_jenis: 0,
        skor_maksimal_jenis: 0,
      },
      {
        id_jenis_pangan: 7,
        nama_jenis: "Kacang-Kacangan",
        bobot_jenis: 0,
        skor_maksimal_jenis: 0,
      },
      {
        id_jenis_pangan: 8,
        nama_jenis: "Buah-Buahan",
        bobot_jenis: 0,
        skor_maksimal_jenis: 0,
      },
      {
        id_jenis_pangan: 9,
        nama_jenis: "Minyak dan Lemak",
        bobot_jenis: 0,
        skor_maksimal_jenis: 0,
      },
      {
        id_jenis_pangan: 10,
        nama_jenis: "Bahan Minuman",
        bobot_jenis: 0,
        skor_maksimal_jenis: 0,
      },
      {
        id_jenis_pangan: 11,
        nama_jenis: "Bahan Minuman",
        bobot_jenis: 0,
        skor_maksimal_jenis: 0,
      },
      {
        id_jenis_pangan: 12,
        nama_jenis: "Bumbu-Bumbuan",
        bobot_jenis: 0,
        skor_maksimal_jenis: 0,
      },
      {
        id_jenis_pangan: 13,
        nama_jenis: "Konsumsi Lainnya",
        bobot_jenis: 0,
        skor_maksimal_jenis: 0,
      },
      {
        id_jenis_pangan: 14,
        nama_jenis: "Makanan dan Minuman Jadi",
        bobot_jenis: 0,
        skor_maksimal_jenis: 0,
      },
      {
        id_jenis_pangan: 15,
        nama_jenis: "Ikan Segar",
        bobot_jenis: 0,
        skor_maksimal_jenis: 0,
      },
      {
        id_jenis_pangan: 16,
        nama_jenis: "Udang dan Hewan Air Lainnya yang Segar",
        bobot_jenis: 0,
        skor_maksimal_jenis: 0,
      },
      {
        id_jenis_pangan: 17,
        nama_jenis: "Ikan Diawetkan",
        bobot_jenis: 0,
        skor_maksimal_jenis: 0,
      },
      {
        id_jenis_pangan: 18,
        nama_jenis: "Udang dan Hewan Air Lainnya yang Diawetkan",
        bobot_jenis: 0,
        skor_maksimal_jenis: 0,
      },
      {
        id_jenis_pangan: 19,
        nama_jenis: "Daging Segar",
        bobot_jenis: 0,
        skor_maksimal_jenis: 0,
      },
      {
        id_jenis_pangan: 20,
        nama_jenis: "Daging Diawetkan",
        bobot_jenis: 0,
        skor_maksimal_jenis: 0,
      },
      {
        id_jenis_pangan: 21,
        nama_jenis: "Lainnya",
        bobot_jenis: 0,
        skor_maksimal_jenis: 0,
      },
    ],
  });
}

seed()
  .then(() => console.log("✅ Seed jenis pangan selesai."))
  .catch((err) => {
    console.error(`❌ Gagal seeding jenis pangan: ${err}`);
    process.exit(1);
  });