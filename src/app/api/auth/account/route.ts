import { Prisma } from "@/lib/prisma";

export async function GET(): Promise<Response> {
  try {
    const pengguna = await Prisma.pengguna.findFirst({
      where: { peran: { in: ["ADMIN", "SURVEYOR"] } },
      select: { nama_lengkap: true, nip: true },
    });

    return new Response(JSON.stringify({ data: pengguna }), { status: 200 });
  } catch (err: unknown) {
    console.error(`Server gagal mengambil data pengguna karena ${err}`);
    return new Response(JSON.stringify({ error: "Gagal mengambil data pengguna" }), { status: 500 });
  }
}