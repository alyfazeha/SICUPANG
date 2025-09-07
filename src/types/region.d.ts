type District = {
  id: number;
  code: string;
  name: string;
  village: Village[];
};

type FamilyWithRegion = {
  name: string;
  district: { name: string; code: string };
  village: { name: string; code: string };
};

type Village = {
  id: number;
  code: string;
  name: string;
};

export { District, FamilyWithRegion, Village };