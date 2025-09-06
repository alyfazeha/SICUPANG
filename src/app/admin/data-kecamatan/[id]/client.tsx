import { District } from "@/types/region";

export default function Page({ district }: { district: Omit<District, "village"> }) {
  return (
    <section>
      {district.name}
    </section>
  );
}