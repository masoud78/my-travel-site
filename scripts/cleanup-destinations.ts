import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Cleaning up invalid destination types...");

  const deleted = await prisma.$executeRawUnsafe(
    `DELETE FROM "Destination" WHERE "type" NOT IN ('CONTINENT','COUNTRY','CITY')`
  );
  console.log(`Deleted ${deleted} invalid destinations`);

  await prisma.$executeRawUnsafe(`UPDATE "Destination" SET "parentId" = NULL WHERE "type" = 'CONTINENT'`);
  await prisma.$executeRawUnsafe(`UPDATE "Destination" SET "parentId" = NULL WHERE "type" = 'COUNTRY'`);
  console.log("Reset parentId for continents and countries");

  const remaining = await prisma.destination.findMany({ select: { id: true, name: true, type: true } });
  console.log("Remaining destinations:", remaining.map((d) => `${d.name} (${d.type})`).join(", "));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
