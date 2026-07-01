import { prisma } from "./prisma";
import { SITE_CONFIG } from "./site-config";

/**
 * Read a setting from DB, falling back to SITE_CONFIG if not found.
 * Cached per-request via React cache().
 */
export async function getSetting(key: string, fallback = ""): Promise<string> {
  try {
    const row = await prisma.setting.findUnique({ where: { key } });
    return row?.value ?? fallback;
  } catch {
    return fallback;
  }
}

export async function getSettings(): Promise<Record<string, string>> {
  try {
    const rows = await prisma.setting.findMany();
    const map: Record<string, string> = {};
    for (const r of rows) map[r.key] = r.value;
    return map;
  } catch {
    return {};
  }
}

/**
 * Resolve site identity, merging DB values onto static defaults.
 */
export async function getSiteIdentity() {
  const settings = await getSettings();
  return {
    name: settings.site_name || SITE_CONFIG.name,
    tagline: settings.site_tagline || SITE_CONFIG.tagline,
    description: settings.site_description || SITE_CONFIG.description,
    phone: settings.phone_primary || SITE_CONFIG.defaultPhone,
    phoneDisplay: settings.phone_display || SITE_CONFIG.defaultPhoneDisplay,
    whatsapp: settings.whatsapp || SITE_CONFIG.whatsapp,
    telegram: settings.telegram || SITE_CONFIG.telegram,
    email: settings.email || SITE_CONFIG.email,
    workingHours: settings.working_hours || SITE_CONFIG.workingHours,
    instagram: settings.instagram_url || SITE_CONFIG.socials.instagram,
    telegramUrl: settings.telegram_url || SITE_CONFIG.socials.telegram,
    whatsappUrl: settings.whatsapp_url || SITE_CONFIG.socials.whatsapp,
    youtubeUrl: settings.youtube_url || SITE_CONFIG.socials.youtube,
  };
}

export type SiteIdentity = Awaited<ReturnType<typeof getSiteIdentity>>;
