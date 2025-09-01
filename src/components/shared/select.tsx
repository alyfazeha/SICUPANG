"use client";

import { useEffect, useRef, useState } from "react";
import type { Select } from "@/types/components";
import { Select as S } from "@/utils/select";
import { ChevronDown, Search } from "lucide-react";
import { Text } from "@/utils/text";

export default function Select({ label, name, onChange, options, required, selected, value }: Select) {
  const wrapper = useRef<HTMLFieldSetElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string | undefined>(selected || value);

  useEffect(() => {
    document.addEventListener("click", (e: MouseEvent) => S.handleClickOutside(e, wrapper, setDropdownOpen));
    return () => document.removeEventListener("click", (e: MouseEvent) => S.handleClickOutside(e, wrapper, setDropdownOpen));
  }, []);

  return (
    <fieldset className="relative flex w-full flex-col justify-between space-y-4 text-sm" ref={wrapper}>
      {label && (
        <label htmlFor={name} className="flex items-center font-medium">
          {label} {required && <h6 className="text-red-500">*</h6>}
        </label>
      )}
      <div className="relative">
        <select
          name={name}
          id={name}
          required={required}
          className="hidden w-full appearance-none rounded-[0.7rem] border-[1.5px] border-[#d1d5db] bg-transparent p-4 focus:ring-0 focus:outline-none"
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value)}
        >
          <option value="" hidden>
            Pilih {label}
          </option>
          {options.map((option, index) => (
            <option key={index} value={S.value(option)}>
              {S.label(option)}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="flex min-h-[2.5rem] w-full cursor-pointer items-center justify-between rounded-[0.7rem] border-[1.5px] border-[#d1d5db] bg-transparent p-4 text-left focus:border-[#22b6d1] focus:shadow-[0_2px_8px_0_#22b6d122]"
          onClick={(e) => {
            e.stopPropagation();
            setDropdownOpen(!dropdownOpen);
          }}
        >
          <h5 className="flex w-full items-center justify-between">
            <span className="truncate">
              {Text.truncate(selectedValue, 20, 40) || `Pilih ${label}`}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 flex-shrink-0 text-gray-400" />
          </h5>
        </button>
        {dropdownOpen && (
          <ul className="absolute z-50 mt-1 max-h-40 w-full overflow-y-auto rounded-[0.7rem] border-[1.5px] border-[#d1d5db] bg-white">
            <li className="sticky top-0 border-b border-gray-200 bg-white p-2">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full rounded-[0.7rem] border border-gray-300 px-4 py-3 focus:border-gray-500 focus:outline-none"
                placeholder="Cari..."
              />
              <Search className="absolute top-1/2 right-6 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </li>
            {S.filteredOptions(options, searchText).map((option, index) => {
              return (
                <li
                  key={index}
                  className={`cursor-pointer p-4 hover:bg-gray-100 ${S.value(option) === selectedValue ? "bg-gray-100" : ""}`}
                  onClick={() => S.selectOption(option, setDropdownOpen, setSelectedValue, onChange)}
                >
                  {S.label(option)}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </fieldset>
  );
}