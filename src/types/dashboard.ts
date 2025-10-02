import { Interface } from "@/utils/decorator";

@Interface
class Dashboard {
  district!: number;
  family!: number;
  graphic!: { x: string; y: number }[];
  villages!: number;
  years!: number[];
};

@Interface
class TopCards {
  title!: string;
  value!: number;
};

export { Dashboard, TopCards };