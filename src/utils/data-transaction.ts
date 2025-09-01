import type { ReactNode } from "react";

export class DataTransaction {
  public static dd(args: unknown | unknown[] | ReactNode): never {
    console.log(`🟣 Dump & Die: ${args}`);

    if (typeof args === "object") {
      console.dir(args, { depth: null });
    }

    throw new Error("❌ Execution stopped by DataTransaction.dd()");
  }
}