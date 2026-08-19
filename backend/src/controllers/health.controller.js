const prisma = require("../config/prisma");

/**
 * Liveness plus a database round-trip. Reporting "ok" while the database is
 * unreachable makes the probe worse than useless — the API cannot serve a
 * single meaningful request without it.
 */
const getHealth = async (_request, response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return response.json({ status: "ok", database: "up" });
  } catch (error) {
    return response.status(503).json({
      status: "degraded",
      database: "down",
      code: error?.code ?? error?.name ?? "UNKNOWN",
    });
  }
};

module.exports = {
  getHealth,
};
