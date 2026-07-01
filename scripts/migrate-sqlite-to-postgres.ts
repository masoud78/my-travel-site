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

const TABLES = [
  "User",
  "Destination",
  "Transport",
  "Tour",
  "TourDate",
  "Hotel",
  "Media",
  "ServiceTemplate",
  "MenuSetting",
  "MenuItem",
  "HomeBlock",
  "Page",
  "BlogPost",
  "BlogCategory",
  "Review",
  "Consultant",
  "TourRequest",
  "Job",
  "JobApplication",
  "Newsletter",
  "Redirect",
  "Setting",
];

function cleanRow(row: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    if (value === null || value === undefined) {
      out[key] = null;
    } else if (typeof value === "bigint") {
      out[key] = Number(value);
    } else if (typeof value === "boolean" || typeof value === "number" || typeof value === "string") {
      out[key] = value;
    } else {
      out[key] = value;
    }
  }
  return out;
}

async function migrateTable(name: string) {
  const rows = sqlite.prepare(`SELECT * FROM ${name}`).all() as Record<string, unknown>[];
  if (!rows.length) {
    console.log(`⏭  ${name}: empty`);
    return;
  }

  // @ts-ignore dynamic access
  await pg[name.toLowerCase()].deleteMany({});

  // @ts-ignore dynamic access
  await pg[name.toLowerCase()].createMany({ data: rows.map(cleanRow), skipDuplicates: true });
  console.log(`✅ ${name}: ${rows.length} rows`);
}

async function main() {
  for (const table of TABLES) {
    try {
      await migrateTable(table);
    } catch (err) {
      console.error(`❌ ${table}:`, err instanceof Error ? err.message : err);
    }
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
