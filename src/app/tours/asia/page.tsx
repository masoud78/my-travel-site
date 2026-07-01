import { Metadata } from "next";
import { CategoryToursPage, categories } from "../category-page";

export async function generateMetadata(): Promise<Metadata> {
  const cat = categories.find((c) => c.slug === "asia");
  return {
    title: cat?.title || "تورهای آسیایی",
    description: `${cat?.subtitle || ""} — ریوان سفر`,
  };
}

export default function AsiaToursPage() {
  return <CategoryToursPage slug="asia" />;
}
