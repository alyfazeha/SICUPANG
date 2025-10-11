import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto flex w-[92%] flex-col items-start justify-between gap-6 py-8 lg:flex-row lg:items-center">
        <section className="flex flex-col items-start gap-4 text-left lg:flex-row lg:items-center">
          <Image
            src="/images/favicon.svg"
            alt="Logo SICUPANG"
            width={48}
            height={48}
            className="h-12 w-12"
            loading="lazy"
          />
          <span>
            <h3 className="font-bold text-gray-800">
              SICUPANG (Sistem Cerdas untuk Ketahanan Pangan)
            </h3>
            <p className="text-sm text-gray-500">
              Otomatisasi survei dan analisis data konsumsi pangan.
            </p>
          </span>
        </section>
        <p className="w-full text-left text-sm text-gray-600 lg:w-auto lg:text-right">
          © 2025 Gatranova
          <br />
          Dinas Ketahanan Pangan Kabupaten Malang
        </p>
      </div>
    </footer>
  );
}