import { Metadata } from "next";
import { CategoryToursPage, categories } from "../category-page";

export async function generateMetadata(): Promise<Metadata> {
  const cat = categories.find((c) => c.slug === "domestic");
  return {
    title: cat?.title || "تورهای داخلی",
    description: `${cat?.subtitle || ""} — ریوان سفر`,
  };
}

export default function DomesticToursPage() {
  return <CategoryToursPage slug="domestic" />;
}
