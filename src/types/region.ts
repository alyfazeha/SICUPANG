import { Interface } from "@/utils/decorator";

@Interface
class District {
  id!: number;
  code!: string;
  name!: string;
  village!: Village[];
};

@Interface
class FamilyWithRegion {
  name!: string;
  district!: { name: string; code: string };
  village!: { name: string; code: string };
};

@Interface
class Village {
  id!: number;
  code!: string;
  name!: string;
};

export { District, FamilyWithRegion, Village };