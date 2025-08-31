import { NextRequest } from "next/server";
import { Prisma } from "@/lib/prisma";


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id_kecamatan: string }> },
): Promise<Response> {
  try {
    const { id_kecamatan } = await params;
    const id = Number(id_kecamatan);
    if (!Number.isFinite(id) || id <= 0) {
      return new Response(
        JSON.stringify({ error: "id_surveyor tidak valid." }, null, 2),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const keluarga = await Prisma.keluarga.findMany({
      where: { id_kecamatan: id },
      select: {
        id_keluarga: true,
        nama_kepala_keluarga: true,
        desa: {
          select: {
            id_desa: true,
            nama_desa: true
          }
        },
      },  
    });


if (!keluarga) {
  return new Response(
    JSON.stringify({ error: "Data keluarga tidak ditemukan." }, null, 2),
    { status: 404, headers: { "Content-Type": "application/json" } }
  );
}

    return new Response(JSON.stringify({ keluarga }, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    console.error("❌ Error GET /api/admin/pangan-keluarga/[id_kecamatan]:", err);
    return new Response(
      JSON.stringify(
        { error: "Gagal mengambil data keluarga." },
        null,
        2,
      ),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
