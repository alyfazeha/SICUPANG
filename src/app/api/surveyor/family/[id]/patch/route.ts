import { mkdir, unlink, writeFile } from "fs/promises";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { cwd } from "process";
import { z } from "zod";
import { API_SURVEYOR_EDIT_DATA_FAMILY, SURVEYOR_FAMILY } from "@/constants/routes";
import { AUTH_TOKEN } from "@/constants/token";
import { Prisma } from "@/lib/prisma";
import type { Auth } from "@/types/auth";
import type { Foodstuff } from "@/types/family";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const token = (await cookies()).get(AUTH_TOKEN)?.value;
    if (!token) return NextResponse.json({ error: "Pengguna tidak terautentikasi" }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    const { payload } = await jwtVerify(token, secret);
    const decoded = payload as unknown as Auth;

    if (!decoded.id_pengguna) {
      return NextResponse.json({ message: "Token surveyor tidak valid" }, { status: 401 });
    }

    const user = await Prisma.pengguna.findUnique({ where: { id_pengguna: decoded.id_pengguna } });
    if (!user) return NextResponse.json({ message: "Pengguna tidak ditemukan" }, { status: 404 });

    const formData = await request.formData();

    // ✅ Ambil id keluarga
    const { params } = context;
    const { id } = await params;
    const id_keluarga = Number(id);
    if (!id_keluarga) return NextResponse.json({ message: "ID keluarga tidak valid" }, { status: 400 });

    // ✅ Convert FormData ke object JS
    const values: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (key !== "photo") values[key] = String(value);
    });

    // ✅ Parse foodstuff
    let foodstuff: Foodstuff[] = [];
    if (values.foodstuff) {
      try {
        foodstuff = JSON.parse(values.foodstuff) as Foodstuff[];
      } catch {
        return NextResponse.json({ message: "Format pangan keluarga tidak valid." }, { status: 400 });
      }
    }

    // ✅ Validasi
    const validate = z.object({
      id_district: z.string(),
      id_surveyor: z.string().nullable(),
      name: z.string().min(1).max(50),
      family_card_number: z.string().min(1).max(16),
      village: z.string().min(1),
      address: z.string().min(1).max(100),
      members: z.string(),
      income: z.string(),
      spending: z.string(),
      pregnant: z.enum(["Ya", "Tidak"]),
      breastfeeding: z.enum(["Ya", "Tidak"]),
      toddler: z.enum(["Ya", "Tidak"]),
    });

    const parsed = validate.safeParse(values);
    if (!parsed.success) {
      console.error(`❌ Error VALIDATION ${API_SURVEYOR_EDIT_DATA_FAMILY(id)}:`, parsed.error.issues);
      return NextResponse.json({ errors: parsed.error.issues }, { status: 400 });
    }

    // ✅ Ambil file (tidak wajib)
    const file = formData.get("photo") as File | null;
    let filename: string | undefined;

    if (file && file.size > 0 && ["image/jpeg", "image/jpg", "image/png"].includes(file.type) && file.size <= 5 * 1024 * 1024) {
      const formattedDate = `${String(new Date().getDate()).padStart(2, "0")}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${new Date().getFullYear()}`;
      const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "").toLowerCase().replace(/[\s_]+/g, "-").replace(/[^a-z0-9-]/g, "-");
      const extension = file.name.split(".").pop()?.toLowerCase();
      filename = `${formattedDate}-${nameWithoutExtension}.${extension}`;

      await mkdir(join(process.cwd(), "public", "storage", "family"), { recursive: true });
      await writeFile(join(process.cwd(), "public", "storage", "family", filename), Buffer.from(await file.arrayBuffer()));
    }

    // ✅ Update ke database
    await Prisma.$transaction(async (table) => {
      const documentation = await table.keluarga.findUnique({
        where: { id_keluarga },
        select: { gambar: true },
      });
      
      if (documentation?.gambar && filename) {
        const path = join(cwd(), "public", documentation.gambar);
        await unlink(path);
      }

      await table.keluarga.update({
        where: { id_keluarga },
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
          ...(filename && { gambar: `/storage/family/${filename}` }),
        },
      });

      // Hapus data pangan lama
      await table.pangan_keluarga.deleteMany({ where: { id_keluarga } });

      // Simpan data pangan baru
      for (const food of foodstuff) {
        await table.pangan_keluarga.create({
          data: {
            id_keluarga,
            id_pangan: food.id,
            urt: food.portion,
            tanggal: new Date(),
          },
        });
      }
    });

    return NextResponse.redirect(new URL(SURVEYOR_FAMILY, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  } catch (err) {
    console.error("Gagal mengedit data keluarga:", err);
    return NextResponse.json({ message: "Gagal mengedit data keluarga" }, { status: 500 });
  }
}