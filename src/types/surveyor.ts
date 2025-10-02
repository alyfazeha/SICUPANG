import { Interface } from "@/utils/decorator";

@Interface
class Surveyor {
  id?: number;
  district?: { id: number; name: string };
  full_name?: string;
  nip?: string;
  password?: string;
  phone_number?: string;
}

export { Surveyor };