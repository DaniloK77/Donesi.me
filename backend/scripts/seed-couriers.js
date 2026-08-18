/**
 * Adds the test couriers without running the full seed.
 *
 *   npm run db:seed:couriers
 *
 * The full seed rebuilds menus, which drops any cart items pointing at them.
 * This only touches the Courier table, so it is safe to run against a database
 * that already has orders in flight.
 */

const { PrismaClient } = require("@prisma/client");
const { seedCouriers } = require("../prisma/seed-data/couriers");

const prisma = new PrismaClient();

seedCouriers(prisma)
  .then(({ created, updated }) => {
    console.log(`\n✔ Kuriri: ${created} novih, ${updated} ažuriranih.\n`);
  })
  .catch((error) => {
    console.error(`\n✖ ${error.message}\n`);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
