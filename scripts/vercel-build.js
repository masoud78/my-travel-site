#!/usr/bin/env node
/**
 * Vercel build wrapper.
 *
 * Vercel/Neon auto-generated env vars may be prefixed (e.g. dbrivan_DATABASE_URL).
 * This script maps them to the standard Prisma env vars:
 *   - DATABASE_URL            (pooled connection for Prisma Client)
 *   - DATABASE_URL_UNPOOLED   (direct connection for migrations)
 */

const { execSync } = require("child_process");

function normalizePooledUrl(url) {
  if (!url) return url;
  const u = new URL(url);
  // Neon pooler is PgBouncer; Prisma needs this flag.
  u.searchParams.set("pgbouncer", "true");
  u.searchParams.set("connect_timeout", "10");
  // channel_binding is not supported through PgBouncer
  u.searchParams.delete("channel_binding");
  return u.toString();
}

function firstValid(...candidates) {
  return candidates.find((v) => typeof v === "string" && v.startsWith("postgresql://"));
}

function mapDatabaseUrls() {
  const rawPooled = firstValid(
    process.env.dbrivan_DATABASE_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL,
    process.env.DATABASE_URL
  );

  const pooled = normalizePooledUrl(rawPooled);

  let unpooled = firstValid(
    process.env.dbrivan_DATABASE_URL_UNPOOLED,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.DATABASE_URL_UNPOOLED
  );

  // Fallback: construct unpooled URL from Neon components provided by Vercel.
  if (!unpooled && process.env.dbrivan_PGHOST_UNPOOLED && process.env.dbrivan_POSTGRES_USER && process.env.dbrivan_POSTGRES_PASSWORD && process.env.dbrivan_PGDATABASE) {
    unpooled = `postgresql://${process.env.dbrivan_POSTGRES_USER}:${process.env.dbrivan_POSTGRES_PASSWORD}@${process.env.dbrivan_PGHOST_UNPOOLED}/${process.env.dbrivan_PGDATABASE}?sslmode=require`;
  }

  if (!pooled) {
    throw new Error(
      "DATABASE_URL not found. Please set dbrivan_DATABASE_URL, POSTGRES_URL, or DATABASE_URL in Vercel environment variables."
    );
  }

  if (!unpooled) {
    console.warn("DATABASE_URL_UNPOOLED not found; using DATABASE_URL as fallback. For Neon, add dbrivan_DATABASE_URL_UNPOOLED or POSTGRES_URL_NON_POOLING.");
    unpooled = rawPooled;
  }

  process.env.DATABASE_URL = pooled;
  process.env.DATABASE_URL_UNPOOLED = unpooled;

  console.log("DATABASE_URL mapped:", process.env.DATABASE_URL.replace(/:[^:@]+@/, ":***@"));
  console.log("DATABASE_URL_UNPOOLED mapped:", process.env.DATABASE_URL_UNPOOLED.replace(/:[^:@]+@/, ":***@"));
}

function run(cmd) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

mapDatabaseUrls();
run("npx prisma generate");
run("npx prisma migrate deploy");
run("next build");
