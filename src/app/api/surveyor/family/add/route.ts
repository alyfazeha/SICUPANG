import { put } from "@vercel/blob";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { AI_SERVICES_URL, API_SURVEYOR_ADD_DATA_FAMILY, SURVEYOR_ADD_DATA_FAMILY, SURVEYOR_FAMILY } from "@/constants/routes";
import { AUTH_TOKEN } from "@/constants/token";
import { Prisma } from "@/lib/prisma";
import type { Auth } from "@/types/auth";
import type { Family, Foodstuff } from "@/types/family";

export async function GET(): Promise<NextResponse> {
  try {
    const token = (await cookies()).get(AUTH_TOKEN)?.value;
    if (!token) return NextResponse.json({ error: "Pengguna tidak terautentikasi" }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    const { payload } = await jwtVerify(token, secret);
    const decoded = payload as unknown as Auth;

    const user = await Prisma.pengguna.findUnique({ where: { id_pengguna: decoded.id_pengguna } });
    if (!user) return NextResponse.json({ message: "Pengguna tidak ditemukan" }, { status: 404 });

    const villages = (await Prisma.desa.findMany({
      where: { id_kecamatan: user.id_kecamatan as number },
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

    return NextResponse.json({ processed_foods: processingFoods, salary: formattedSalary, villages }, { status: 200 });
  } catch (err: unknown) {
    console.error(`❌ Error GET ${API_SURVEYOR_ADD_DATA_FAMILY}: ${err}`);
    return NextResponse.json({ error: "Gagal mengambil data keluarga." }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const token = (await cookies()).get(AUTH_TOKEN)?.value;

    if (!token) {
      return NextResponse.json({ error: "Pengguna tidak terautentikasi" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    const { payload } = await jwtVerify(token, secret);
    const decoded = payload as unknown as Auth;

    if (!decoded.id_pengguna) {
      return NextResponse.json({ message: "Token surveyor tidak valid" }, { status: 401 });
    }

    const user = await Prisma.pengguna.findUnique({ where: { id_pengguna: decoded.id_pengguna } });
    if (!user) return NextResponse.json({ message: "Pengguna tidak ditemukan" }, { status: 404 });

    const formData = await request.formData();
    const file = formData.get("photo") as File | null;
    if (!file) {
      return NextResponse.json({ message: "Foto wajib diunggah." }, { status: 400 });
    }

    const blob = await put(file.name, file, { access: "public", addRandomSuffix: true });

    // ✅ Convert FormData ke object JS
    const values: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (key !== "photo") values[key] = String(value);
    });

    // ✅ Parse foodstuff dengan type
    let foodstuff: Foodstuff[] = [];
    if (values.foodstuff) {
      try {
        foodstuff = JSON.parse(values.foodstuff) as Foodstuff[];
      } catch {
        return NextResponse.json({ message: "Format pangan keluarga tidak valid." }, { status: 400 });
      }
    }

    // ✅ Adaptasi field biar sesuai validasi
    const normalized: Record<keyof Pick<Family, "id_district" | "id_foods" | "id_surveyor" | "members" | "breastfeeding" | "pregnant" | "toddler" | "portion" | "village">, unknown> = {
      ...values,
      id_district: Number(values.id_district) || 0,
      id_foods: foodstuff[0]?.id ?? 0,
      id_surveyor: values.id_surveyor ?? null,
      members: Number(values.members) || 0,
      breastfeeding: values.breastfeeding === "Ya" ? "Ya" : "Tidak",
      pregnant: values.pregnant === "Ya" ? "Ya" : "Tidak",
      toddler: values.toddler === "Ya" ? "Ya" : "Tidak",
      portion: foodstuff[0]?.portion ?? 0,
      village: values.village || "",
    };

    const validate = z.object({
      id_district: z.number(),
      id_surveyor: z.string().nullable(),
      name: z.string().min(1).max(50),
      family_card_number: z.string().min(1).max(16),
      village: z.string().min(1),
      address: z.string().min(1).max(100),
      members: z.number(),
      income: z.string().min(1).max(50),
      spending: z.string().min(1).max(50),
      pregnant: z.enum(["Ya", "Tidak"]),
      breastfeeding: z.enum(["Ya", "Tidak"]),
      toddler: z.enum(["Ya", "Tidak"]),
    });

    const parsed = validate.safeParse(normalized);
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.issues }, { status: 400 });
    }

    const keluarga = await Prisma.keluarga.create({
      data: {
        id_kecamatan: Number(user.id_kecamatan),
        id_pengguna: decoded.id_pengguna,
        nama_kepala_keluarga: parsed.data.name,
        nomor_kartu_keluarga: parsed.data.family_card_number,
        id_desa: Number(parsed.data.village),
        alamat: parsed.data.address,
        jumlah_keluarga: Number(parsed.data.members),
        rentang_pendapatan: Number(parsed.data.income),
        rentang_pengeluaran: Number(parsed.data.spending),
        hamil: parsed.data.pregnant,
        menyusui: parsed.data.breastfeeding,
        balita: parsed.data.toddler,
        gambar: blob.url,
      },
    });

    if (foodstuff && foodstuff.length > 0) {
      fetch(`${AI_SERVICES_URL}/api/ingredient-extract`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          family_id: keluarga.id_keluarga,
          items: foodstuff.map((food) => ({ food_name: food.name, portion: food.portion })),
        }),
      }).catch((err) => {
        console.error("Gagal memicu proses ekstraksi AI di Azure:", err);
      });
    }

    return NextResponse.redirect(new URL(SURVEYOR_FAMILY, request.url), 303);
  } catch (err) {
    console.error(`❌ Error POST ${SURVEYOR_ADD_DATA_FAMILY}:`, err);
    return NextResponse.json({ message: "Gagal menambah data keluarga" }, { status: 500 });
  }
}