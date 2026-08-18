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

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({
    code: "INTERNAL_ERROR",
    error: "Something went wrong. Please try again.",
  });
});

app.listen(port, () => {
  console.log(`donesi.me API is running on port ${port}`);
});
