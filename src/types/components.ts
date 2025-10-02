import type { ChangeEvent, ReactElement, ReactNode } from "react";
import type { Roles } from "@/types/auth";
import { Interface } from "@/utils/decorator";

@Interface
class Input {
  errors?: Partial<Record<string, string>>;
  icon: ReactNode;
  info?: string | null;
  label!: string;
  name!: string;
  onChange?: ((value: ChangeEvent<HTMLInputElement>) => void) | null;
  placeholder?: string;
  required!: boolean;
  type!: "text" | "date" | "email" | "file" | "password" | "number";
  value?: string | number | readonly string[] | undefined;
  variant!: "auth" | "form";
};

@Interface
class Radio {
  label!: string;
  name!: string;
  onChange?: (value: string) => void;
  options!: { label: string | number; value: number | string }[];
  required!: boolean;
  value?: string;
};

@Interface
class Select {
  label!: string;
  name!: string;
  onChange?: (value: string) => void;
  options!: Array<{ label: string; value: string }>;
  required!: boolean;
  value?: string;
};

@Interface
class Sidebar {
  href?: string;
  icon?: ReactElement;
  isOpen?: boolean;
  label?: string;
  onClose?: () => void;
  role?: Roles;
  subMenu?: Sidebar[];
};

@Interface
class Table {
  headers!: string[];
  rows!: ReactNode[][];
  sortable!: string[];
};

export { Input, Radio, Select, Sidebar, Table };