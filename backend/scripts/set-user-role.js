/**
 * Grants a role to an existing account.
 *
 *   npm run user:role -- danilodakakovacevic@gmail.com
 *   npm run user:role -- someone@example.com CUSTOMER
 *
 * Roles are read from the database on every request, so the change takes effect
 * on the next page load — no need to sign out and back in.
 *
 * The account has to exist first: register through the app, then run this.
 */

const { PrismaClient, UserRole } = require("@prisma/client");

const prisma = new PrismaClient();
const ROLES = Object.keys(UserRole);

const [emailArgument, roleArgument = "ADMIN"] = process.argv.slice(2);
const email = emailArgument?.trim().toLowerCase();
const role = roleArgument.trim().toUpperCase();

const fail = (message) => {
  console.error(`\n✖ ${message}\n`);
  process.exitCode = 1;
};

async function main() {
  if (!email) {
    return fail(
      "Missing email.\n  Usage: npm run user:role -- <email> [ROLE]\n" +
        `  Roles: ${ROLES.join(", ")}`,
    );
  }

  if (!ROLES.includes(role)) {
    return fail(`Unknown role "${role}". Roles: ${ROLES.join(", ")}`);
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!user) {
    return fail(
      `No account found for ${email}.\n` +
        "  Register through the app first, then run this again.",
    );
  }

  if (user.role === role) {
    console.log(`\n• ${user.email} already has the ${role} role.\n`);
    return;
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { role },
    select: { email: true, name: true, role: true },
  });

  console.log(
    `\n✔ ${updated.name} <${updated.email}>: ${user.role} → ${updated.role}\n` +
      "  Reload the app for the change to show up.\n",
  );
}

main()
  .catch((error) => {
    fail(error.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
