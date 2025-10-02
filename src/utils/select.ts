import type { Dispatch, RefObject, SetStateAction } from "react";

class Select {
  public static filteredOptions(options: Array<{ label: string; value: string }>, searchText: string) {
    if (!searchText) return options;
    return options.filter((option) => this.label(option).toLowerCase().includes(searchText.toLowerCase()));
  }

  public static handleClickOutside(event: MouseEvent, wrapper: RefObject<HTMLFieldSetElement | null>, setDropdownOpen: Dispatch<SetStateAction<boolean>>) {
    return wrapper.current && !wrapper.current.contains(event.target as Node) && setDropdownOpen(false);
  }

  public static label(option: string | { label: string }) {
    return typeof option === "string" ? option : option.label;
  }

  public static selectOption(
    option: { label: string; value: string },
    setDropdownOpen: Dispatch<SetStateAction<boolean>>,
    setSelectedValue: Dispatch<SetStateAction<string | undefined>>,
    onChange?: (value: string) => void
  ) {
    setSelectedValue(this.value(option));
    setDropdownOpen(false);
    onChange?.(this.value(option));
  }

  public static value(option: string | { value: string }) {
    return typeof option === "string" ? option : option.value;
  }
}

export const FilteredOptions = Select.filteredOptions;
export const HandleClickOutside = Select.handleClickOutside;
export const Label = Select.label;
export const Value = Select.value;
export const SelectOption = Select.selectOption;
export { Select };