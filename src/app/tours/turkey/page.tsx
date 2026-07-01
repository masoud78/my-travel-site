import { Metadata } from "next";
import { CategoryToursPage, categories } from "../category-page";

export async function generateMetadata(): Promise<Metadata> {
  const cat = categories.find((c) => c.slug === "turkey");
  return {
    title: cat?.title || "تورهای ترکیه",
    description: `${cat?.subtitle || ""} — ریوان سفر`,
  };
}

export default function TurkeyToursPage() {
  return <CategoryToursPage slug="turkey" />;
}
