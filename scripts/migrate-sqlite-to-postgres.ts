/**
 * Migrate data from SQLite dev.db to PostgreSQL.
 *
 * Usage:
 *   1. Set DATABASE_URL to PostgreSQL in .env
 *   2. Keep a copy of prisma/dev.db as the source
 *   3. Ensure prisma/schema.prisma provider = "postgresql"
 *   4. Run: npx tsx scripts/migrate-sqlite-to-postgres.ts
 */

import { PrismaClient } from "@prisma/client";
import Database from "better-sqlite3";

const pg = new PrismaClient({ log: ["error"] });
const sqlite = new Database("prisma/dev.db");

const TABLES: { table: string; model: keyof PrismaClient }[] = [
  { table: "User", model: "user" },
  { table: "Destination", model: "destination" },
  { table: "Hotel", model: "hotel" },
  { table: "Transport", model: "transport" },
  { table: "Tour", model: "tour" },
  { table: "TourDate", model: "tourDate" },
  { table: "TourHotel", model: "tourHotel" },
  { table: "TourFaq", model: "tourFaq" },
  { table: "Review", model: "review" },
  { table: "BlogPost", model: "blogPost" },
  { table: "ContactRequest", model: "contactRequest" },
  { table: "Consultant", model: "consultant" },
  { table: "Branch", model: "branch" },
  { table: "Page", model: "page" },
  { table: "Menu", model: "menu" },
  { table: "MediaLibrary", model: "mediaLibrary" },
  { table: "ServiceTemplate", model: "serviceTemplate" },
  { table: "Banner", model: "banner" },
  { table: "Job", model: "job" },
  { table: "HomeBlock", model: "homeBlock" },
  { table: "MenuSetting", model: "menuSetting" },
  { table: "GalleryItem", model: "galleryItem" },
  { table: "MediaLogo", model: "mediaLogo" },
  { table: "Setting", model: "setting" },
  { table: "Redirect", model: "redirect" },
  { table: "Newsletter", model: "newsletter" },
];

const BOOLEAN_FIELDS = new Set([
  "isActive", "isMain", "isFeatured", "isLastMinute", "isPinned", "isDefault", "isPublic",
  "isRead", "isReplied", "isDefaultBranch", "published", "hasVideo",
  "requiresAuth", "allowComments", "showInFooter", "showInHeader", "isExternal",
  "isGlobal", "isPrimary",
]);

const DATE_FIELDS = new Set([
  "createdAt", "updatedAt", "publishedAt", "expiresAt", "lastLoginAt", "departureDate", "returnDate",
  "startDate", "endDate", "appliedAt", "repliedAt", "submittedAt", "departDate",
]);

function cleanRow(row: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    if (value === null || value === undefined) {
      out[key] = null;
    } else if (BOOLEAN_FIELDS.has(key)) {
      out[key] = value === 1 || value === true || value === "1";
    } else if (DATE_FIELDS.has(key)) {
      if (typeof value === "number" && value > 1000000000000) {
        out[key] = new Date(value);
      } else if (typeof value === "number") {
        out[key] = new Date(value * 1000);
      } else if (typeof value === "string") {
        out[key] = new Date(value);
      } else {
        out[key] = value;
      }
    } else if (typeof value === "bigint") {
      out[key] = Number(value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

async function migrateTable(table: string, model: keyof PrismaClient) {
  const rows = sqlite.prepare(`SELECT * FROM "${table}"`).all() as Record<string, unknown>[];
  if (!rows.length) {
    console.log(`⏭  ${table}: empty`);
    return;
  }

  try {
    // @ts-ignore dynamic access
    await pg[model].deleteMany({});
    // @ts-ignore dynamic access
    await pg[model].createMany({ data: rows.map(cleanRow), skipDuplicates: true });
    console.log(`✅ ${table}: ${rows.length} rows`);
  } catch (err) {
    console.error(`❌ ${table}:`, err instanceof Error ? err.message : err);
  }
}

async function main() {
  for (const { table, model } of TABLES) {
    await migrateTable(table, model);
  }
}

main()
  .then(async () => {
    await pg.$disconnect();
    sqlite.close();
    console.log("Migration complete.");
  })
  .catch(async (err) => {
    console.error(err);
    await pg.$disconnect();
    sqlite.close();
    process.exit(1);
  });
