type Family = {
  id_district: number | string;
  id_surveyor: number | null;
  name: string;
  family_card_number: string;
  village: string;
  address: string;
  members: number;
  income: string;
  spending: string;
  pregnant: MultiConfirmation;
  breastfeeding: MultiConfirmation;
  toddler: MultiConfirmation;
  photo: File | undefined;
  foodstuff: Foodstuff[];
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
  name: string;
  portion: number;
};

type Form =  {
  processed_foods: { id: number; label: string }[];
  salary: { id: number; label: string }[];
  villages: { id: number; label: string }[];
};

type MultiConfirmation = "YA" | "TIDAK";

export { Family, FamilyFoods, Foodstuff, Form };