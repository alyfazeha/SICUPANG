async function seed() {}

seed()
  .catch((err: unknown) => {
    console.error(process.env.NODE_ENV !== "production" && `Terjadi kesalahan saat mengisi data pengguna: ${err}`);
    process.exit(1);
  })
  .finally(async () => {
    // await Prisma.$disconnect();
  });