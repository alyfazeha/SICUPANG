import { put, del } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { z } from "zod";
import { Prisma } from "@/lib/prisma";
import { AUTH_TOKEN } from "@/constants/token";
import { AI_SERVICES_URL, SURVEYOR_FAMILY } from "@/constants/routes";
import type { Auth } from "@/types/auth";
import type { Foodstuff } from "@/types/family";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = (await cookies()).get(AUTH_TOKEN)?.value;
    if (!token) return NextResponse.json({ error: "Pengguna tidak terautentikasi" }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    const { payload } = await jwtVerify(token, secret);
    const decoded = payload as unknown as Auth;

    const user = await Prisma.pengguna.findUnique({ where: { id_pengguna: decoded.id_pengguna } });
    if (!user) return NextResponse.json({ message: "Pengguna tidak ditemukan" }, { status: 404 });

    const { id } = await params;
    const id_keluarga = Number(id);
    const formData = await request.formData();
    if (!id_keluarga) return NextResponse.json({ message: "ID keluarga tidak valid" }, { status: 400 });

    const validationSchema = z.object({
      name: z.string().min(1, "Nama kepala keluarga wajib diisi."),
      family_card_number: z.string().min(16, "Nomor KK harus 16 digit.").max(16, "Nomor KK harus 16 digit."),
      village: z.string().min(1, "Desa wajib dipilih."),
      address: z.string().min(1, "Alamat wajib diisi."),
      members: z.coerce.number().min(1, "Jumlah anggota harus minimal 1."),
      income: z.string().min(1, "Pendapatan wajib dipilih."),
      spending: z.string().min(1, "Pengeluaran wajib dipilih."),
      pregnant: z.enum(["Ya", "Tidak"]),
      breastfeeding: z.enum(["Ya", "Tidak"]),
      toddler: z.enum(["Ya", "Tidak"]),
      foodstuff: z.string().optional(),
    });

    const dataToValidate = Object.fromEntries(formData.entries());
    const parsed = validationSchema.safeParse(dataToValidate);

    if (!parsed.success) {
      console.error(`❌ Error VALIDATION /api/surveyor/family/${id}/patch: `, parsed.error.issues);
      return NextResponse.json({ errors: parsed.error.issues }, { status: 400 });
    }

    const { name, family_card_number, village, address, members, income, spending, pregnant, breastfeeding, toddler } = parsed.data;

    let foodstuff: Foodstuff[] = [];
    if (parsed.data.foodstuff) {
      try {
        foodstuff = JSON.parse(parsed.data.foodstuff) as Foodstuff[];
      } catch {
        return NextResponse.json({ message: "Format pangan keluarga tidak valid." }, { status: 400 });
      }
    }

    const oldFamilyData = await Prisma.keluarga.findUnique({ where: { id_keluarga }, select: { gambar: true } });
    let newImageUrl = oldFamilyData?.gambar;
    const file = formData.get("photo") as File | null;

    if (file && file.size > 0) {
      const blob = await put(file.name, file, { access: "public", addRandomSuffix: true });
      newImageUrl = blob.url;

      if (oldFamilyData?.gambar) {
        try {
          await del(oldFamilyData.gambar);
        } catch (delError) {
          console.warn(`Gagal menghapus file lama dari Blob: ${delError}`);
        }
      }
    }

    await Prisma.keluarga.update({
      where: { id_keluarga },
      data: {
        id_kecamatan: Number(user.id_kecamatan),
        id_pengguna: decoded.id_pengguna,
        nama_kepala_keluarga: name,
        nomor_kartu_keluarga: family_card_number,
        id_desa: Number(village),
        alamat: address,
        jumlah_keluarga: members,
        rentang_pendapatan: Number(income),
        rentang_pengeluaran: Number(spending),
        hamil: pregnant,
        menyusui: breastfeeding,
        balita: toddler,
        gambar: newImageUrl,
      },
    });

    await Prisma.pangan_keluarga.deleteMany({ where: { id_keluarga } });

    if (foodstuff && foodstuff.length > 0) {
      fetch(`${AI_SERVICES_URL}/api/ingredient-extract`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          family_id: id_keluarga,
          items: foodstuff.map((food) => ({ food_name: food.name, portion: food.portion })),
        }),
      }).catch((err) => console.error("Gagal memicu proses ekstraksi AI di Azure (edit):", err));
    }

    return NextResponse.redirect(new URL(SURVEYOR_FAMILY, request.url), 303);
  } catch (err) {
    console.error("Gagal mengedit data keluarga:", err);
    return NextResponse.json({ message: "Gagal mengedit data keluarga" }, { status: 500 });
  }
}