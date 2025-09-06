type District = {
  id: number;
  code: string;
  name: string;
  village: Village[];
};

type Village = {
  id: number;
  code: string;
  name: string;
};

export { District, Village };