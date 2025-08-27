import type { ChangeEvent, ReactElement, ReactNode } from "react";
import type { Roles } from "@/types/auth";

type InputType = "text" | "date" | "email" | "file" | "password" | "number";
type InputVariant = "auth" | "form";

type ValidationErrorDetail =
  | { type: "required" }
  | { type: "min"; min: number; actual: number }
  | { type: "max"; max: number; actual: number }
  | { type: "minlength"; requiredLength: number; actualLength: number }
  | { type: "maxlength"; requiredLength: number; actualLength: number }
  | { type: "custom"; message: string };

type ValidationErrors = Partial<Record<string, ValidationErrorDetail>>;

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

type SidebarMenu = {
  href?: string;
  icon: ReactElement;
  label: string;
  subMenu?: SidebarMenu[];
};

type Sidebar = SidebarMenu & {
  isOpen: boolean;
  role: Roles;
  onClose: () => void;
};

type Table = {
  headers: string[];
  rows: (string | number)[][];
  sortable: string[];
};

export { Input, Sidebar, SidebarMenu, Table, ValidationErrors };