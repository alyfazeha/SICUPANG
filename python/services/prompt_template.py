import os
import re
import json
import polars as pl
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from polars import DataFrame
from typing import Optional, TypedDict, Dict, List

load_dotenv()

class Bahan(TypedDict):
    nama: str
    jumlah: str
    harga: int
    manfaat: str

class Rekomendasi(TypedDict):
    bahan_makanan: Dict[str, List[Bahan]]
    total_perkiraan_pengeluaran: int

class RAGModel:
    def __init__(self, model: str = "gemini-1.5-flash-latest") -> None:
        self.api_key: str = os.getenv("GOOGLE_API_KEY", "")

        if not self.api_key:
            raise ValueError("Google API Key tidak ditemukan.")

        self.llm: ChatGoogleGenerativeAI = ChatGoogleGenerativeAI(model=model, temperature=0.2)
        self.price_context: Optional[str] = None

        self.prompt_template_recommendation: PromptTemplate = PromptTemplate(
            input_variables=['budget', 'price_context', 'riwayat_penyakit', 'alergi'],
            template="""
                Anda adalah asisten gizi. Buat rencana bahan makanan bergizi (karbohidrat, protein, sayur, buah, pelengkap) untuk 4 orang selama 1 bulan, dengan total budget Rp{budget}.
                Gunakan data harga bahan makanan wilayah Jawa Timur berikut sebagai acuan: {price_context}.

                Perhatikan kebutuhan kalori harian rata-rata manusia (sekitar 2000–2500 kkal).

                Perhatikan juga kondisi berikut:
                - Riwayat penyakit yang harus diperhatikan: {riwayat_penyakit}
                - Alergi makanan yang harus dihindari: {alergi}

                Balas hanya dalam format JSON valid dengan struktur:
                {{
                  "bahan_makanan": {{
                    "karbohidrat": [
                      {{
                        "nama": string,
                        "jumlah": string,
                        "harga": int,
                        "manfaat": string
                      }}],
                    "protein": [...],
                    "sayuran": [...],
                    "buah": [...],
                    "pelengkap": [...]
                  }},
                  "total_perkiraan_pengeluaran": int
                }}

                Jangan sertakan teks lain di luar JSON.
            """
        )

        self.chain: Optional[object] = None

    def load_and_prepare_price_context(self, file_path: Optional[str] = None, province: str = "JAWA TIMUR") -> None:
        print("--- Membaca dan memproses file CSV ---")
        if file_path is None:
            file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../data/dataset.csv"))

        try:
            df: DataFrame = pl.read_csv(file_path)
            df_province = df.filter(pl.col("Nama Provinsi").str.strip_chars().str.to_lowercase() == province.lower())

            if df_province.height == 0:
                print("❌ Data harga untuk provinsi yang diminta tidak ditemukan.")
                self.price_context = None
                return

            df_province = df_province.with_columns(pl.col("Harga").cast(str).str.replace("Rp", "").str.replace(",", "").str.strip_chars().cast(pl.Int64, strict=False)).drop_nulls("Harga")
            latest_prices = df_province.sort(["Tahun", "Bulan"], descending=[True, True]).unique(subset=["Komoditas"], keep="first")

            price_list: List[str] = [f"{row['Komoditas']}: Rp{row['Harga']}" for row in latest_prices.to_dicts()]
            self.price_context = ", ".join(price_list)

            print("✅ Konteks harga berhasil dibuat dan disimpan di memori.")
            self.chain = self.prompt_template_recommendation | self.llm

        except FileNotFoundError:
            print("❌ File data harga tidak ditemukan.")
            self.price_context = None
        except Exception as e:
            print(f"❌ Gagal memproses data harga: {e}")
            self.price_context = None

    def get_recommendation(self, budget: int, riwayat_penyakit: str, alergi: str) -> Optional[Rekomendasi]:
        if not self.price_context:
            print("🚫 Gagal membuat rekomendasi karena masalah data harga.")
            return None

        print("🚀 Menghasilkan rekomendasi bahan makanan...")

        result: object = self.chain.invoke({  # type: ignore
            "budget": budget,
            "price_context": self.price_context,
            "riwayat_penyakit": riwayat_penyakit,
            "alergi": alergi
        })

        content: str = getattr(result, "content", "")  # type: ignore
        match = re.search(r"```json\s*(.*?)\s*```", content, re.DOTALL)

        if match:
            json_str: str = match.group(1)
            try:
                parsed: Rekomendasi = json.loads(json_str)
                return parsed
            except json.JSONDecodeError as e:
                print(f"⚠️ Gagal parse JSON: {e}")
                return None
        else:
            print("⚠️ Format response tidak sesuai. Tidak ditemukan blok ```json ... ```.")
            return None