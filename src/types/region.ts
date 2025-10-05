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
  id!: number;
  name!: string;
  district!: { name: string; code: string };
  village!: { name: string; code: string };
};

@Interface
class Pph {
  nama_kecamatan!: string;
  nama_jenis!: string;
  kalori_per_orang!: number;
  lemak_per_orang!: number;
  karbo_per_orang!: number;
  protein_per_orang!: number;
}

@Interface
class Village {
  id!: number;
  code!: string;
  name!: string;
};

export { District, FamilyWithRegion, Pph, Village };