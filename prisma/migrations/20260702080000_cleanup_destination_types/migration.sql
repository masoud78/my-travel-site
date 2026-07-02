-- Remove invalid destination types and clean legacy data
DELETE FROM "Destination" WHERE "type" NOT IN ('CONTINENT','COUNTRY','CITY');

-- Ensure all CITY rows have a parent country
UPDATE "Destination" SET "parentId" = NULL WHERE "type" = 'CONTINENT';
UPDATE "Destination" SET "parentId" = NULL WHERE "type" = 'COUNTRY';
