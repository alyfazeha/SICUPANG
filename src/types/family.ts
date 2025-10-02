import { Interface } from "@/utils/decorator";

export type Status = "DITERIMA" | "DITOLAK" | "MENUNGGU";
export type MultiConfirmation = "YA" | "TIDAK";

@Interface
class Family {
  id_district!: number | string;
  id_family!: number | string | null;
  id_surveyor!: number | null;
  name!: string;
  family_card_number!: string | null;
  village!: string | number;
  address!: string;
  members!: number;
  income!: string | number;
  spending!: string | number;
  pregnant!: MultiConfirmation | null;
  breastfeeding!: MultiConfirmation | null;
  toddler!: MultiConfirmation | null;
  photo!: File | string | undefined;
  foodstuff!: Foodstuff[];
  id_foods?: string;
  portion?: number;
  status?: Status;
  comment?: string | null;
  created_at!: Date;
  updated_at!: Date;
};

@Interface
class FamilyFoods {
  id_family_foods!: number;
  id_foods!: number;
  id_family!: number;
  portion!: number;
};

@Interface
class FoodData {
  id!: number;
  amount!: number;
  calories!: number;
  carbohydrate!: number;
  category!: string;
  conversion!: string;
  energy!: number;
  fat!: number;
  name!: string;
  protein!: number;
  total_family!: number;
  unit!: string | number;
  weight!: number;
}

@Interface
class Foodstuff {
  id!: number;
  name!: string;
  portion!: number;
};

@Interface
class Form {
  processed_foods!: { id: number; label: string }[];
  salary!: { id: number; label: string }[];
  villages!: { id: number; label: string }[];
};

@Interface
class SalaryRange {
  id!: number;
  lower_limit!: string;
  upper_limit!: string;
};

export { Family, FamilyFoods, FoodData, Foodstuff, Form, SalaryRange };