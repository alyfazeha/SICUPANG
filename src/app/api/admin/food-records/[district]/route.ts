import { NextRequest } from "next/server";
import { Prisma } from "@/lib/prisma";


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ district: string }> },
): Promise<Response> {
  try {
    const { district } = await params;
    const id = Number(district);
    if (!Number.isFinite(id) || id <= 0) {
      return new Response(
        JSON.stringify({ error: "id_surveyor invalid." }, null, 2),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const family = await Prisma.keluarga.findMany({
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


if (!family) {
  return new Response(
    JSON.stringify({ error: "Family data not found" }, null, 2),
    { status: 404, headers: { "Content-Type": "application/json" } }
  );
}

    return new Response(JSON.stringify({ family }, null, 2), {
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