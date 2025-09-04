type Status = "DITERIMA" | "DITOLAK" | "MENUNGGU";
type MultiConfirmation = "YA" | "TIDAK";

type Family = {
  id_district: number | string;
  id_family: number | string | null;
  id_surveyor: number | null;
  name: string;
  family_card_number: string | null;
  village: string | number;
  address: string;
  members: number;
  income: string | number;
  spending: string | number;
  pregnant: MultiConfirmation | null;
  breastfeeding: MultiConfirmation | null;
  toddler: MultiConfirmation | null;
  photo: File | string | undefined;
  foodstuff: Foodstuff[];
  status?: Status;
  comment?: string | null;
  created_at: Date;
  updated_at: Date;
};

type FamilyFoods = {
  id_family_foods: number;
  id_foods: number;
  id_family: number;
  portion: number;
};

type Foodstuff = {
  id: number;
  name: string;
  portion: number;
};

type Form =  {
  processed_foods: { id: number; label: string }[];
  salary: { id: number; label: string }[];
  villages: { id: number; label: string }[];
};

type SalaryRange = {
  id: number;
  lower_limit: string;
  upper_limit: string;
};

export { Family, FamilyFoods, Foodstuff, Form, MultiConfirmation, SalaryRange, Status };