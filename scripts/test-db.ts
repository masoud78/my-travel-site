import { prisma } from "../src/lib/prisma";

async function main() {
  try {
    await prisma.$connect();
    const result = await prisma.$queryRawUnsafe("SELECT NOW() as now");
    console.log("PRISMA OK", (result as any[])[0].now);
  } catch (e: any) {
    console.error("PRISMA FAIL", e.message, e.stack);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
