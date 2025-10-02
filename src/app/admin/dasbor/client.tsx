"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FaChartSimple, FaCheckDouble } from "react-icons/fa6";
import type { Dashboard, TopCards } from "@/types/dashboard";

export default function DasborAdmin({ district, family, graphic, villages, years }: Dashboard) {
  const charts = useRef<HTMLDivElement>(null);
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [showOptions, setShowOptions] = useState<boolean>(false);

  useEffect(() => {
    if (!charts.current || !graphic.length) return;
    (async () => {
      const ApexCharts = (await import("apexcharts")).default;
      const chart = new ApexCharts(charts.current, {
        chart: { type: "bar", height: 350, toolbar: { show: false } },
        plotOptions: {
          bar: { borderRadius: 6, horizontal: false, columnWidth: "55%" },
        },
        dataLabels: { enabled: false },
        xaxis: {
          categories: graphic.map((item) => item.x),
          labels: { style: { colors: "#fff" } },
        },
        yaxis: { labels: { style: { colors: "#fff" } } },
        series: [{ name: "Jumlah Keluarga", data: graphic.map((item) => item.y) }],
        colors: ["#38bdf8"],
        grid: { borderColor: "rgba(255,255,255,0.2)" },
      });

      chart.render();
      return () => chart.destroy();
    })();
  }, [graphic]);

  const cards: TopCards[] = [
    { title: "Jumlah Kecamatan", value: district },
    { title: "Jumlah Keluarga", value: family },
    { title: "Jumlah Desa", value: villages },
  ];

  return (
    <>
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {cards.map((data, index) => (
          <figure key={index} className="bg-primary relative overflow-hidden rounded-2xl p-6 text-white shadow-lg">
            <h3 className="mb-2 cursor-default text-sm opacity-80">
              {data.title}
            </h3>
            <h5 className="relative z-10 text-2xl font-bold">
              {data.value ?? 0}
            </h5>
            <div className="bg-secondary absolute -right-6 -bottom-6 h-28 w-28 rounded-full opacity-30" />
          </figure>
        ))}
      </section>
      <section className="bg-primary mt-8 w-full rounded-2xl p-6 shadow-lg">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <span className="flex items-center text-white">
            <FaChartSimple className="mr-3 text-2xl" />
            <h5 className="text-lg font-semibold">Data Kecamatan Per Tahun</h5>
          </span>
          <fieldset className="relative">
            <button type="button" onClick={() => setShowOptions(!showOptions)} className="text-primary flex w-40 cursor-pointer items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5 text-sm font-semibold shadow-lg">
              {selectedYear || "Pilih Tahun"}
              <ChevronDown className="text-primary ml-2" />
            </button>
            {showOptions && (
              <ul className="absolute z-10 mt-2 w-40 rounded-lg bg-white shadow-lg">
                {years.map((year, index) => (
                  <li
                    key={index}
                    onClick={() => { setSelectedYear(year); setShowOptions(false) }}
                    className="text-primary cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 ease-in-out hover:bg-slate-100"
                  >
                    {year}
                  </li>
                ))}
              </ul>
            )}
          </fieldset>
        </div>
        <hr className="mb-6 border-white/30" />
        {graphic.length ? (
          <div ref={charts} className="w-full" />
        ) : (
          <span className="flex flex-col items-center justify-center p-6 text-center text-white">
            <FaCheckDouble className="mb-6 text-4xl" />
            <h4 className="text-lg font-semibold">
              Belum ada data keluarga yang terverifikasi.
            </h4>
          </span>
        )}
      </section>
    </>
  );
}