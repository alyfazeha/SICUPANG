import type { Family } from "@/types/family";

export default function Page({ family }: { family: Family }) {
  return <main>{family.name}</main>;
}