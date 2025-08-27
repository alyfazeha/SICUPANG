"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, TriangleAlert } from "lucide-react";
import type { Table } from "@/types/components";

export default function Table({ headers, rows, sortable }: Table) {
  const [sortingItems, setSortingItems] = useState<{ index: number; ascending: boolean }>({ index: -1, ascending: true });
  const [sortedRows, setSortedRows] = useState<(string | number)[][]>(rows);

  const isSortable = (header: string) => sortable.map((sort) => sort.toLowerCase()).includes(header.toLowerCase());

  const handleSort = (index: number) => {
    const ascending = sortingItems.index === index ? !sortingItems.ascending : true;
    setSortingItems({ index, ascending });

    setSortedRows([...rows].sort((a, b) => {
      const valA = String(a[index]).toLowerCase();
      const valB = String(b[index]).toLowerCase();
      return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }));
  };

  const displayedRows = sortingItems.index === -1 ? rows : sortedRows;

  return (
    <section className="border-primary relative mb-6 w-full overflow-x-auto rounded-lg border">
      <table className="w-full min-w-max table-auto border-collapse cursor-default">
        <thead className="bg-primary text-white">
          <tr>
            {headers.map((header, i) => (
              <th key={i} className={`w-1/${headers.length} px-6 py-4 text-right font-medium tracking-wider`}>
                {isSortable(header) ? (
                  <div onClick={() => handleSort(i)} className="flex cursor-pointer items-center justify-center space-x-2 text-xs font-medium whitespace-nowrap">
                    <h5>{header}</h5>
                    {sortingItems.index !== i ? <ArrowUpDown size={14} /> : sortingItems.ascending ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2 text-xs font-medium whitespace-nowrap">
                    <h5>{header}</h5>
                  </div>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayedRows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="py-12 text-center text-gray-500">
                <section className="flex flex-col items-center justify-center gap-2">
                  <TriangleAlert className="text-yellow-400" size={40} />
                  <h5 className="text-sm font-semibold text-slate-800">
                    Tidak ada data, yuk isi dulu!
                  </h5>
                </section>
              </td>
            </tr>
          ) : (
            displayedRows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-primary border-t text-sm transition-all duration-200">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-6 py-3 whitespace-nowrap">
                    <section className="flex cursor-default items-center justify-center space-x-3 text-[10pt]" dangerouslySetInnerHTML={{ __html: String(cell) }} />
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}