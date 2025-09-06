type Dashboard = {
  district: number;
  family: number;
  villages: number;
  graphic: { x: string; y: number }[];
  years: number[];
};

type TopCards = {
  title: string;
  value: number;
};

export { Dashboard, TopCards };