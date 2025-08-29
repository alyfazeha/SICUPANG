import type { Radio } from "@/types/components";

export default function Radio({ label, name, options, required }: Radio) {
  return (
    <fieldset className="flex w-full flex-col justify-between space-y-4 text-sm">
      <h5 className="font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </h5>
      <div className="flex items-center space-x-6">
        {options.map((option, index) => (
          <span key={index} className="inline-flex cursor-pointer items-center">
            <input
              type="radio"
              name={name}
              id={`${name}_${option.value}`}
              className="h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
              required={required}
            />
            <label htmlFor={`${name}_${option.value}`} className="ml-2 cursor-pointer">
              {option.label}
            </label>
          </span>
        ))}
      </div>
    </fieldset>
  );
}