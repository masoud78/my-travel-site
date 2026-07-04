import { PrismaClient } from "@prisma/client";

function mapDatabaseUrlFromVercelNeon() {
  // Vercel/Neon integration may expose env vars with a prefix or under standard names.
  const pooled =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.dbrivan_DATABASE_URL;

  // Skip URL normalization for SQLite (file: protocol)
  if (!pooled || pooled.startsWith("file:")) {
    return;
  }

  const unpooled =
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.dbrivan_DATABASE_URL_UNPOOLED;

  if (!pooled) {
    // We cannot recover without a database URL; let Prisma raise the usual error.
    return;
  }

  // Normalize pooled connection for Prisma + PgBouncer (Neon pooler).
  const url = new URL(pooled);
  url.searchParams.set("pgbouncer", "true");
  url.searchParams.set("connect_timeout", "10");
  url.searchParams.delete("channel_binding");

  process.env.DATABASE_URL = url.toString();

  if (unpooled) {
    process.env.DATABASE_URL_UNPOOLED = unpooled;
  } else if (process.env.dbrivan_PGHOST_UNPOOLED && process.env.dbrivan_POSTGRES_USER && process.env.dbrivan_POSTGRES_PASSWORD && process.env.dbrivan_PGDATABASE) {
    process.env.DATABASE_URL_UNPOOLED =
      `postgresql://${process.env.dbrivan_POSTGRES_USER}:${process.env.dbrivan_POSTGRES_PASSWORD}@${process.env.dbrivan_PGHOST_UNPOOLED}/${process.env.dbrivan_PGDATABASE}?sslmode=require`;
  } else {
    // migrations disabled in runtime; fallback to pooled URL is acceptable for client reads.
    process.env.DATABASE_URL_UNPOOLED = pooled;
  }
}

mapDatabaseUrlFromVercelNeon();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
