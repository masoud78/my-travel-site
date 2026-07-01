import { Footer } from "./footer";
import { getMenuSettings } from "@/lib/admin-actions";
import { SITE_CONFIG } from "@/lib/site-config";

export async function FooterContainer() {
  const settings = await getMenuSettings();
  const footer = settings.find((s) => s.location === "FOOTER" && s.isActive);

  return (
    <Footer
      logoSrc={footer?.logo || SITE_CONFIG.logo}
      siteTitle={footer?.title || SITE_CONFIG.name}
      siteSubtitle={footer?.subtitle || SITE_CONFIG.tagline}
    />
  );
}
