type Form =  {
  salary: { id: number; label: string }[];
  villages: { id: number; label: string }[];
};

type Family = {
  name: string;
  family_card_number: string;
  village: string;
  address: string;
  members: number;
  income: string;
  spending: string;
  pregnant: boolean;
  breastfeeding: boolean;
  toddler: boolean;
  photo: string;
  foodstuff: Foodstuff[];
  created_at: Date;
  updated_at: Date;
};

type Foodstuff = {
  name: string;
  quantity: number;
};

export { Family, Foodstuff, Form };