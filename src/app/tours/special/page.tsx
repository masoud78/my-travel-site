import { Metadata } from "next";
import { CategoryToursPage, categories } from "../category-page";

export async function generateMetadata(): Promise<Metadata> {
  const cat = categories.find((c) => c.slug === "special");
  return {
    title: cat?.title || "تورهای ویژه",
    description: `${cat?.subtitle || ""} — ریوان سفر`,
  };
}

export default function SpecialToursPage() {
  return <CategoryToursPage slug="special" />;
}
