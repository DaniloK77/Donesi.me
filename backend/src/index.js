const path = require("node:path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { frontendUrl, port } = require("./config/env");
const addressesRoutes = require("./routes/addresses.routes");
const adminRoutes = require("./routes/admin.routes");
const authRoutes = require("./routes/auth.routes");
const cartRoutes = require("./routes/cart.routes");
const categoriesRoutes = require("./routes/categories.routes");
const dealsRoutes = require("./routes/deals.routes");
const deliveryRoutes = require("./routes/delivery.routes");
const healthRoutes = require("./routes/health.routes");
const ordersRoutes = require("./routes/orders.routes");
const popularRestaurantsRoutes = require(
  "./routes/popular-restaurants.routes",
);
const restaurantsRoutes = require("./routes/restaurants.routes");
const streetsRoutes = require("./routes/streets.routes");
const usersRoutes = require("./routes/users.routes");

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Uploaded images. Served read-only; filenames are generated, never taken
// from the client.
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads"), {
    maxAge: "7d",
    index: false,
    dotfiles: "deny",
  }),
);

app.use("/health", healthRoutes);
app.use("/api/addresses", addressesRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/deals", dealsRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/popular-restaurants", popularRestaurantsRoutes);
app.use("/api/restaurants", restaurantsRoutes);
app.use("/api/streets", streetsRoutes);
app.use("/api/users", usersRoutes);

app.use((request, response) => {
  response.status(404).json({
    code: "NOT_FOUND",
    error: "The requested resource was not found.",
  });
});

/**
 * Prisma connectivity failures are not application bugs — the database is
 * briefly unreachable or still waking up. They deserve a 503 the client can
 * retry, and a one-line log instead of a stack trace that buries real errors.
 */
const CONNECTIVITY_CODES = new Set([
  "P1001", // can't reach the database server
  "P1002", // the server was reached but timed out
  "P1008", // operation timed out
  "P1017", // server closed the connection
]);

/**
 * A query against a live client reports a P100x code; a client that never got
 * a connection in the first place throws PrismaClientInitializationError with
 * no code at all. Both mean the same thing to a caller.
 */
const isDatabaseUnreachable = (error) =>
  CONNECTIVITY_CODES.has(error?.code) ||
  error?.name === "PrismaClientInitializationError";

app.use((error, _request, response, _next) => {
  if (isDatabaseUnreachable(error)) {
    console.error(
      `[db] ${error.code ?? error.name}: database unreachable` +
        (error.meta?.database_location ? ` (${error.meta.database_location})` : ""),
    );

    return response.status(503).json({
      code: "DATABASE_UNAVAILABLE",
      error: "The service is temporarily unavailable. Please try again shortly.",
    });
  }

  console.error(error);

  return response.status(500).json({
    code: "INTERNAL_ERROR",
    error: "Something went wrong. Please try again.",
  });
});

app.listen(port, () => {
  console.log(`donesi.me API is running on port ${port}`);
});
