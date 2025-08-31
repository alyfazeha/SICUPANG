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
        JSON.stringify({ error: "id_kecamatan tidak valid." }, null, 2),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const { searchParams } = new URL(req.url);
    const desa = searchParams.get("desa") ?? undefined;
    const nama = searchParams.get("nama") ?? undefined;

    const pageRaw = Number(searchParams.get("page"));
    const limitRaw = Number(searchParams.get("limit"));
    const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
    const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? limitRaw : 25;
    const skip = (page - 1) * limit;

    const where: any = {
      id_kecamatan: id,
    };

    if (desa || nama) {
      const orConditions = [];
      
      if (desa) {
        orConditions.push({
          id_desa: Number(desa) 
        });
      }
      
      if (nama) {
        orConditions.push({
          nama_kepala_keluarga: {
            contains: nama
          }
        });
      }
      where.OR = orConditions;
    }

    const keluarga = await Prisma.keluarga.findMany({
      where,
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
      skip, 
      take: limit,
    });

    if (keluarga.length === 0) {
      return new Response(
        JSON.stringify({ error: "Data keluarga tidak ditemukan." }, null, 2),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const total = await Prisma.keluarga.count({ where });

    return new Response(
      JSON.stringify({
        keluarga,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }, null, 2),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

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