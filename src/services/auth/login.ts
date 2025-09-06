import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ADMIN_DASHBOARD, API_LOGIN, SURVEYOR_DASHBOARD } from "@/constants/routes";
import { Form } from "@/services/superclass/form";
import type { Auth } from "@/types/auth";
import type { ValidationErrors } from "@/types/components";
import axios, { AxiosError } from "axios";

export class Login extends Form {
  constructor() {
    super();
  }

  public static validate(form: Pick<Auth, "nip" | "kata_sandi">) {
    const errors: Record<string, string> = {};
    if (!(form.nip as string).trim()) errors.nip = "NIP wajib diisi.";
    if (!form.kata_sandi.trim()) errors.kata_sandi = "Kata sandi wajib diisi.";
    return errors;
  }

  public static async submit(
    e: FormEvent,
    form: Pick<Auth, "nip" | "kata_sandi">,
    setErrors: Dispatch<SetStateAction<Record<keyof typeof form, ValidationErrors[keyof ValidationErrors]>>>,
    setAlert: Dispatch<SetStateAction<"success" | "error" | null>>,
    setInfo: Dispatch<SetStateAction<string>>,
    setLoading: Dispatch<SetStateAction<boolean>>,
    router: AppRouterInstance
  ) {
    e.preventDefault();
    setLoading(true);
    setInfo("");

    const errors = this.validate(form);
    setErrors(errors);

    if (Object.values(errors).some((err) => err !== undefined)) {
      setLoading(false);
      return;
    }

    try {
      const response = (await axios.post<{ data: Auth }>(API_LOGIN, form)).data;
      setAlert("success");
      setInfo("Berhasil masuk ke akun Anda.");

      setTimeout(() => {
        setInfo("");
        router.push(response.data.peran === "ADMIN" ? ADMIN_DASHBOARD : SURVEYOR_DASHBOARD);
      }, 1200);
    } catch (err: unknown) {
      setAlert("error");

      if ((err as AxiosError).response?.status === 401) {
        setInfo("Email atau kata sandi salah.");
        console.error(process.env.NODE_ENV === "development" && err);
      } else {
        setInfo("Terjadi kesalahan pada server, silakan coba lagi.");
        console.error(process.env.NODE_ENV === "development" && err);
      }

      setTimeout(() => setInfo(""), 2000);
    } finally {
      setLoading(false);
    }
  }
}