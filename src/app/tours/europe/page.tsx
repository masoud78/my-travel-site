import { Metadata } from "next";
import { CategoryToursPage, categories } from "../category-page";

export async function generateMetadata(): Promise<Metadata> {
  const cat = categories.find((c) => c.slug === "europe");
  return {
    title: cat?.title || "تورهای اروپا",
    description: `${cat?.subtitle || ""} — ریوان سفر`,
  };
}

export default function EuropeToursPage() {
  return <CategoryToursPage slug="europe" />;
}
