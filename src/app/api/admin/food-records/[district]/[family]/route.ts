import { NextRequest } from "next/server";
import { Prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ family: string }> },
): Promise<Response> {
  try {
    const { family } = await params;
    const id = Number(family);
    if (!Number.isFinite(id) || id <= 0) {
      return new Response(
        JSON.stringify({ error: "id_surveyor invalid" }, null, 2),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const families_food = await Prisma.keluarga.findMany({
      where: { id_keluarga: id },
      select: {
        id_keluarga: true,
        nama_kepala_keluarga: true,
        jumlah_keluarga: true,
        alamat: true,
        pendapatan: true,
        pengeluaran: true,
        balita: true,
        menyusui: true,
        hamil: true,
        desa: {
          select: {
            id_desa: true,
            nama_desa: true,
          },
        },
        pangan_keluarga: {
          select: {
            id_pangan_keluarga: true,
            tanggal: true,
            urt: true,
            pangan: {
              select: {
                id_pangan: true,
                nama_pangan: true,
                id_takaran: true,
                takaran: {
                  select: {
                    nama_takaran: true,
                  },
                },
              },
            },
          },
          orderBy: [{ tanggal: "desc" }, { id_pangan_keluarga: "asc" }],
        },
      },
    });

      const response = families_food.map(fam => {
      const byDate = fam.pangan_keluarga.reduce((acc, row) => {
        const tgl = row.tanggal.toISOString().slice(0, 10);
        (acc[tgl] ??= []).push({
          id_pangan_keluarga: row.id_pangan_keluarga,
          urt: row.urt,
          pangan: row.pangan,
        });
        return acc;
      }, {} as Record<string, any[]>);

      return {
        id_keluarga: fam.id_keluarga,
        nama_kepala_keluarga: fam.nama_kepala_keluarga,
        konsumsi_per_tanggal: Object.entries(byDate).map(([tanggal, items]) => ({
          tanggal,
          items,
        })),
      };
    });

    if (response.length === 0) {
      return new Response(
        JSON.stringify(
          { error: "families food data not found" },
          null,
          2,
        ),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ response }, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    console.error(
      "❌ Error GET /api/admin/rekap-pangan/[id_kecamatan]/[id_keluarga]:",
      err,
    );
    return new Response(
      JSON.stringify({ error: "Gagal mengambil data rekap pangan." }, null, 2),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}