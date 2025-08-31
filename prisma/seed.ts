import { Prisma } from "@/lib/prisma";

async function main() {
  await Prisma.takaran.deleteMany();
  await Prisma.jenis_pangan.deleteMany();
  await Prisma.pangan.deleteMany();
  await Prisma.desa.deleteMany();
  await Prisma.kecamatan.deleteMany();
  await Prisma.pengguna.deleteMany();

  await import("./kecamatan");
  await import("./desa");
  await import("./jenis-pangan");
  await import("./takaran");
  await import("./pangan");
  await import("./pengguna");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  });