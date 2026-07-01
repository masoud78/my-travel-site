import { Header } from "./header";
import { getMenuSettings } from "@/lib/admin-actions";
import { SITE_CONFIG } from "@/lib/site-config";

export async function HeaderContainer() {
  const settings = await getMenuSettings();
  const header = settings.find((s) => s.location === "HEADER" && s.isActive);

  return (
    <Header
      logoSrc={header?.logo || SITE_CONFIG.logo}
      siteTitle={header?.title || SITE_CONFIG.name}
      siteSubtitle={header?.subtitle || SITE_CONFIG.tagline}
    />
  );
}
