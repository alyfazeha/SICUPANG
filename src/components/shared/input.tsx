"use client";

import { useState, ChangeEvent, WheelEvent } from "react";
import type { Input } from "@/types/components";
import { Eye, EyeOff } from "lucide-react";

export default function Input({ icon, label, name, onChange, placeholder, required, type, variant, errors = {}, info = null, value = undefined }: Input) {
  const [showPassword, setShowPassword] = useState(false);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    if (type === "number") newValue = newValue.replace(/[^0-9.,]/g, "").replace(/(,.*?),/g, "$1");
    else if (type === "text") newValue = newValue.replace(/[^a-zA-Z0-9\s.,?!:;'"\-()\/]/g, "");

    e.target.value = newValue;
    onChange(e);
  };

  const handleWheel = (e: WheelEvent<HTMLInputElement>) => {
    if (type === "number") {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  return (
    <fieldset className={`flex w-full flex-col justify-between ${!info ? "space-y-4" : ""}`}>
      {variant !== "auth" && (
        <label htmlFor={name} className="text-sm font-medium text-[var(--primary-text)]">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {info && (
        <h6 className="mt-1 mb-3 cursor-default text-xs text-red-500">
          {info}
        </h6>
      )}
      <div className="relative">
        {icon && type !== "file" && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-6 text-slate-500/50">
            {icon}
          </span>
        )}
        <input
          id={name}
          name={name}
          type={type === "password" ? showPassword ? "text" : "password" : type || "text"}
          value={type !== "file" ? value : undefined}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          step={type === "number" ? "any" : undefined}
          onChange={handleInput}
          onWheel={handleWheel}
          className={`box-border w-full rounded-[0.7rem] border-[1.5px] border-[#d1d5db] bg-white text-sm text-[#222] shadow-[0_1px_4px_rgba(60,60,60,0.04)] transition-all duration-200 outline-none placeholder:text-sm placeholder:text-[#b0b8c1] placeholder:opacity-100 focus:border-[#22b6d1] focus:shadow-[0_2px_8px_0_#22b6d122] ${variant === "auth" && "text-sm"} ${type !== "file" ? "py-3.75 pl-14" : ""} ${type === "password" ? "pr-12" : "pr-4"} ${type === "file" ? "file:mr-4 file:cursor-pointer file:rounded file:border-0 file:bg-[var(--green-tertiary)] file:px-4 file:py-2 file:text-white" : ""}`}
        />
        {type === "password" && (
          <span onClick={() => setShowPassword((prev) => !prev)} className="absolute top-1/2 right-6 -translate-y-1/2 cursor-pointer text-gray-500">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        )}
      </div>
      {errors && Object.values(errors).map((err, index) => {
        if (!err) return null;
        return <h5 key={index} className="text-sm text-red-500"></h5>;
      })}
    </fieldset>
  );
}