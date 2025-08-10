import type { ChangeEvent, ReactNode } from "react";
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

export type SidebarConfig = {
  email: string;
  initial: string;
  name: string;
  type: Roles;
};

type SidebarMenuItem = {
  action?: () => void;
  id: string;
  icon: ReactNode;
  label: string;
  link?: string;
  subMenu?: SidebarMenuItem[];
};

export { Input, SidebarConfig, SidebarMenuItem, ValidationErrors };