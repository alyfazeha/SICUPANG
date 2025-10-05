import { NextRequest, NextResponse } from "next/server";
import { utils, write } from "xlsx";
import { Prisma } from "@/lib/prisma";
import { Pph } from "@/types/region";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const idDistrict = searchParams.get("kecamatan");
    const year = searchParams.get("tahun");

    if (!idDistrict || !year) {
      return NextResponse.json({ error: "Parameter 'kecamatan' dan 'tahun' dibutuhkan." }, { status: 400 });
    }

    const district = await Prisma.kecamatan.findUnique({
      where: { id_kecamatan: Number(idDistrict) },
      select: { nama_kecamatan: true },
    });

    if (!district) {
      return NextResponse.json({ error: "Kecamatan tidak ditemukan." }, { status: 404 });
    }

    const pphQuery: Pph[] = await Prisma.$queryRaw`
        SELECT 
          k.nama_kecamatan,
          jp.nama_jenis,
          (SUM(p.kalori * pk.urt) / kl.jumlah_keluarga) AS kalori_per_orang,
          (SUM(p.lemak * pk.urt) / kl.jumlah_keluarga) AS lemak_per_orang,
          (SUM(p.karbohidrat * pk.urt) / kl.jumlah_keluarga) AS karbo_per_orang,
          (SUM(p.protein * pk.urt) / kl.jumlah_keluarga) AS protein_per_orang
        FROM pangan_keluarga pk
        JOIN keluarga kl ON pk.id_keluarga = kl.id_keluarga
        JOIN pangan p ON pk.id_pangan = p.id_pangan
        JOIN jenis_pangan jp ON p.id_jenis_pangan = jp.id_jenis_pangan
        JOIN kecamatan k ON kl.id_kecamatan = k.id_kecamatan
        WHERE kl.id_kecamatan = ${Number(idDistrict)} AND YEAR(pk.tanggal) = ${Number(year)}
        GROUP BY k.nama_kecamatan, jp.nama_jenis, kl.jumlah_keluarga
        ORDER BY jp.nama_jenis ASC;
    `;

    if (pphQuery.length === 0) {
      return NextResponse.json({ error: "No data found for the selected district and year." }, { status: 404 });
    }

    const headers = ["No", "Kecamatan", "Jenis Pangan", "Kalori / Orang", "Lemak / Orang", "Karbohidrat / Orang", "Protein / Orang"];
    const rows = pphQuery.map((item, index) => [index + 1, item.nama_kecamatan, item.nama_jenis, item.kalori_per_orang, item.lemak_per_orang, item.karbo_per_orang, item.protein_per_orang]);
    const worksheet = utils.aoa_to_sheet([headers, ...rows]);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Rekap PPH");

    return new NextResponse(write(workbook, { bookType: "xlsx", type: "buffer" }), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${`Rekap PPH ${district.nama_kecamatan.replace(/\s+/g, "_")} - Tahun ${year}.xlsx`}"`,
      },
    });
  } catch (error) {
    console.error("Gagal ekspor data PPH:", error);
    return NextResponse.json({ error: "Kesalahan server internal selama ekspor data PPH." }, { status: 500 });
  }
}