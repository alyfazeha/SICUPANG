"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, TriangleAlert } from "lucide-react";
import { type ReactNode, useState } from "react";
import type { Table } from "@/types/components";

export default function Table({ headers, rows, sortable }: Table) {
  const [sortingItems, setSortingItems] = useState<{ index: number; ascending: boolean }>({ index: -1, ascending: true });
  const [sortedRows, setSortedRows] = useState<ReactNode[][]>(rows);

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
    <div className="border-primary relative mb-6 w-full overflow-x-auto rounded-lg border">
      <table className="w-full min-w-max table-auto border-collapse cursor-default">
        <thead className="bg-primary text-white">
          <tr>
            {headers.map((header, i) => (
              <th key={i} className={`w-1/${headers.length} px-6 py-4 text-right font-medium`}>
                {isSortable(header) ? (
                  <span onClick={() => handleSort(i)} className="flex cursor-pointer items-center justify-center text-xs font-medium whitespace-nowrap lg:text-sm">
                    <h5 className="mr-2">{header}</h5>
                    {sortingItems.index !== i ? <ArrowUpDown size={14} /> : sortingItems.ascending ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                  </span>
                ) : (
                  <h5 className="flex items-center justify-center text-xs font-medium whitespace-nowrap lg:text-sm">
                    {header}
                  </h5>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayedRows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="py-12 text-center text-gray-500">
                <span className="flex flex-col items-center justify-center gap-2">
                  <TriangleAlert className="text-yellow-400" size={40} />
                  <h5 className="text-sm font-semibold text-slate-800">
                    Tidak ada data, yuk isi dulu!
                  </h5>
                </span>
              </td>
            </tr>
          ) : (
            displayedRows.map((rows, rowIndex) => (
              <tr key={rowIndex} className="border-primary border-t text-sm transition-all duration-200">
                {rows.map((cells, cellIndex) => (
                  <td key={cellIndex} className="px-6 py-3 whitespace-nowrap">
                    <span className="flex cursor-default items-center justify-center space-x-3 text-sm">
                      {cells}
                    </span>
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}