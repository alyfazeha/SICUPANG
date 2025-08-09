import os
import re
import json
import pandas as pd
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate

load_dotenv()

class RAGModel:
    def __init__(self, model="gemini-1.5-flash-latest"):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            raise ValueError("API key tidak ditemukan")

        self.llm = ChatGoogleGenerativeAI(
            model=model,
            temperature=0.2
        )
        self.price_context = None  

        self.prompt_template_recommendation = PromptTemplate(
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

        self.chain = None

    def load_and_prepare_price_context(self, file_path=None, province="JAWA TIMUR") -> None:
        print("--- Membaca dan memproses file CSV ---")
        if file_path is None:
            file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../data/dataset.csv"))
        try:
            df = pd.read_csv(file_path)

            df_province = df[df['Nama Provinsi'].str.strip().str.lower() == province.lower()].copy()
            if df_province.empty:
                print("❌ Data harga untuk provinsi yang diminta tidak ditemukan.")
                self.price_context = None
                return

            df_province['Harga'] = (
                df_province['Harga']
                .astype(str)
                .str.replace("Rp", "", regex=False)
                .str.replace(",", "", regex=False)
                .str.strip()
            )

            df_province['Harga'] = pd.to_numeric(df_province['Harga'], errors='coerce')
            df_province = df_province.dropna(subset=['Harga'])
            df_province['Harga'] = df_province['Harga'].astype(int)

            df_province = df_province.sort_values(by=['Tahun', 'Bulan'], ascending=[False, False])
            latest_prices = df_province.drop_duplicates(subset=['Komoditas'], keep='first')

            price_list = [f"{row['Komoditas']}: Rp{row['Harga']}" for _, row in latest_prices.iterrows()]
            self.price_context = ", ".join(price_list)

            print("✅ Konteks harga berhasil dibuat dan disimpan di memori.")
            self.chain = self.prompt_template_recommendation | self.llm

        except FileNotFoundError:
            print("❌ File data harga tidak ditemukan.")
            self.price_context = None
        except Exception as e:
            print(f"❌ Gagal memproses data harga: {e}")
            self.price_context = None

    def get_recommendation(self, budget: int, riwayat_penyakit: str, alergi: str):
        if not self.price_context:
            print("🚫 Gagal membuat rekomendasi karena masalah data harga.")
            return None

        print("🚀 Menghasilkan rekomendasi bahan makanan...")
        result = self.chain.invoke({
            "budget": budget,
            "price_context": self.price_context,
            "riwayat_penyakit": riwayat_penyakit,
            "alergi": alergi
        })

        content = result.content

        match = re.search(r"```json\s*(.*?)\s*```", content, re.DOTALL)
        if match:
            json_str = match.group(1)
            try:
                return json.loads(json_str)
            except json.JSONDecodeError as e:
                print(f"⚠️ Gagal parse JSON: {e}")
                return None
        else:
            print("⚠️ Format response tidak sesuai. Tidak ditemukan blok ```json ... ```.")  
            return None
