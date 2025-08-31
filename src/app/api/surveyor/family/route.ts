import { Prisma } from "@/lib/prisma";

export async function GET(): Promise<Response> {
  try {
    const villages = (await Prisma.desa.findMany({
      select: { id_desa: true, nama_desa: true, kode_wilayah: true },
      distinct: ["id_desa"],
    })).map((village) => ({
      id: village.id_desa,
      label: `${village.nama_desa} - ${village.kode_wilayah}`,
    }));

    const processingFoods = (await Prisma.pangan.findMany({
      select: { id_pangan: true, nama_pangan: true },
      distinct: ["id_pangan"],
    })).map((food) => ({
      id: food.id_pangan,
      label: food.nama_pangan,
    }));

    const salaryRanges = await Prisma.rentang_uang.findMany({
      select: { id_rentang_uang: true, batas_atas: true, batas_bawah: true },
      distinct: ["id_rentang_uang"],
    });

    const formattedSalary = salaryRanges.map((salary) => {
      if (salary.id_rentang_uang === 1) return { id: salary.id_rentang_uang, label: `< ${salary.batas_atas}` }; 
      else if (salary.id_rentang_uang === 15) return { id: salary.id_rentang_uang, label: `Lebih dari ${salary.batas_atas}` }; 
      return { id: salary.id_rentang_uang, label: `${salary.batas_bawah} - ${salary.batas_atas}` };
    });

    return new Response(JSON.stringify({ processed_foods: processingFoods, salary: formattedSalary, villages }), { status: 200 });
  } catch (err: unknown) {
    console.error(`Terjadi kesalahan saat mengambil data yang berkaitan dengan keluarga: ${err}`);
    return new Response(JSON.stringify({ error: "Gagal mengambil data keluarga." }), { status: 500 });
  }
}