import { Prisma } from "@/lib/prisma";

async function main() {
  await Prisma.pangan_keluarga.deleteMany();
  await Prisma.pangan.deleteMany();
  await Prisma.takaran.deleteMany();
  await Prisma.jenis_pangan.deleteMany();
  await Prisma.keluarga.deleteMany();
  await Prisma.desa.deleteMany();
  await Prisma.pengguna.deleteMany();
  await Prisma.kecamatan.deleteMany();
  await Prisma.rentang_uang.deleteMany();

  await import("./kecamatan");
  await import("./desa");
  await import("./jenis-pangan");
  await import("./takaran");
  await import("./pangan");
  await import("./pengguna");
  await import("./rentang-uang");
}

main().catch((err: unknown) => {
  console.error(`❌ Seed failed: ${err}`);
  process.exit(1);
});