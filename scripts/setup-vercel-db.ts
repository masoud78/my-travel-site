/**
 * Setup script for Vercel/Neon PostgreSQL.
 *
 * Run after setting DATABASE_URL to your online PostgreSQL:
 *   npx tsx scripts/setup-vercel-db.ts
 *
 * This will:
 *   1. Deploy Prisma migrations
 *   2. Migrate existing data from prisma/dev.db (if present)
 *   3. Seed default data
 */

import { spawnSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

function run(cmd: string, args: string[] = []) {
  console.log(`> ${cmd} ${args.join(" ")}`);
  const result = spawnSync(cmd, args, { stdio: "inherit", shell: true });
  if (result.status !== 0) {
    console.error(`Command failed: ${cmd} ${args.join(" ")}`);
    process.exit(result.status ?? 1);
  }
}

async function main() {
  const devDb = path.join(process.cwd(), "prisma", "dev.db");
  const hasDevDb = fs.existsSync(devDb);

  // 1. Deploy migrations
  run("npx", ["prisma", "migrate", "deploy"]);

  // 2. Migrate existing SQLite data if available
  if (hasDevDb) {
    console.log("Found prisma/dev.db — migrating data to PostgreSQL...");
    run("npx", ["tsx", "scripts/migrate-sqlite-to-postgres.ts"]);
  } else {
    console.log("No prisma/dev.db found — skipping data migration.");
  }

  // 3. Seed default data
  run("npx", ["tsx", "prisma/seed.ts"]);

  console.log("✅ Vercel database setup complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
