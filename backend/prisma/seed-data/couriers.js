/**
 * Test couriers. Kept in its own module so the full seed and the standalone
 * `npm run db:seed:couriers` share one list instead of drifting apart.
 */

const couriers = [
  { name: "Stefan Radulović", phone: "+382 67 204 118", vehicle: "SCOOTER", rating: 4.9 },
  { name: "Ivan Marković", phone: "+382 68 331 902", vehicle: "BICYCLE", rating: 4.8 },
  { name: "Miloš Vujošević", phone: "+382 69 447 210", vehicle: "CAR", rating: 4.7 },
  { name: "Jelena Popović", phone: "+382 67 512 663", vehicle: "SCOOTER", rating: 5 },
  { name: "Vuk Nikolić", phone: "+382 68 690 574", vehicle: "CAR", rating: 4.6 },
];

/** Idempotent: couriers are matched on their phone number. */
async function seedCouriers(prisma) {
  let created = 0;
  let updated = 0;

  for (const courier of couriers) {
    const existing = await prisma.courier.findFirst({
      where: { phone: courier.phone },
      select: { id: true },
    });

    if (existing) {
      await prisma.courier.update({ where: { id: existing.id }, data: courier });
      updated += 1;
    } else {
      await prisma.courier.create({ data: courier });
      created += 1;
    }
  }

  return { created, updated };
}

module.exports = { couriers, seedCouriers };
