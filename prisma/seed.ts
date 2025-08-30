// prisma/seed.ts
async function main() {

  await import("./kecamatan");
  await import("./desa");
  await import("./pengguna");

  await import("./jenis_pangan");
  await import("./takaran");
  await import("./pangan");
}

main()
  .then(() => console.log("✅ All seeds done"))
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  });
