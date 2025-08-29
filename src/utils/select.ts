import type { Dispatch, RefObject, SetStateAction } from "react";

export class Select {
  public static filteredOptions(options: Array<string | { label: string; value: string }>, searchText: string) {
    if (!searchText) return options;
    return options.filter((option) => this.label(option).toLowerCase().includes(searchText.toLowerCase()));
  }

  public static handleClickOutside(event: MouseEvent, wrapper: RefObject<HTMLFieldSetElement | null>, setDropdownOpen: Dispatch<SetStateAction<boolean>>) {
    return wrapper.current && !wrapper.current.contains(event.target as Node) && setDropdownOpen(false);
  }

  public static label(option: string | { label: string }) {
    return typeof option === "string" ? option : option.label;
  }

  public static selectOption(option: string | { label: string; value: string }, setDropdownOpen: Dispatch<SetStateAction<boolean>>, setSelectedValue: Dispatch<SetStateAction<string | undefined>>) {
    setSelectedValue(this.value(option));
    setDropdownOpen(false);
  }

  public static value(option: string | { value: string }) {
    return typeof option === "string" ? option : option.value;
  }
}