import type { ChangeEvent, ReactElement, ReactNode } from "react";
import type { Roles } from "@/types/auth";

type InputType = "text" | "date" | "email" | "file" | "password" | "number";
type InputVariant = "auth" | "form";
type ValidationErrors = Partial<Record<string, string>>;

type Input = {
  errors?: ValidationErrors;
  icon: ReactNode;
  info?: string | null;
  label: string;
  name: string;
  onChange: (value: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required: boolean;
  type: InputType;
  value?: string | number | readonly string[] | undefined;
  variant: InputVariant;
};

type Radio = {
  label: string;
  name: string;
  options: { label: string | number; value: number | string }[];
  required: boolean;
};

type Select = {
  label: string;
  name: string;
  options: { label: string; value: string }[] | Array<string | { label: string; value: string }>;
  required: boolean;
  selected?: string;
  value?: string;
};

type SidebarItem = {
  href?: string;
  icon: ReactElement;
  label: string;
  subMenu?: SidebarItem[];
};

type Sidebar = SidebarItem & {
  isOpen: boolean;
  role: Roles;
  onClose: () => void;
};

type Table = {
  headers: string[];
  rows: (string | number)[][];
  sortable: string[];
};

export { Input, Radio, Select, Sidebar, SidebarItem, Table, ValidationErrors };