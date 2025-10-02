import type { ReactElement } from "react";
import { Interface } from "@/utils/decorator";

@Interface
class Benefit {
  icon!: ReactElement;
  title!: string;
  description!: string;
}

export { Benefit };