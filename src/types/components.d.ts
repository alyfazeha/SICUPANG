import { ReactNode } from "react";

type InputType = "text" | "date" | "email" | "file" | "password" | "number";
type InputVariant = "auth" | "form";

type Input = {
  errors?: Record<string, ReactNode>;
  icon: ReactNode;
  info?: string | null;
  label: string;
  name: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required: boolean;
  type: InputType;
  value?: string | number | readonly string[] | undefined;
  variant: InputVariant;
};

export { Input };