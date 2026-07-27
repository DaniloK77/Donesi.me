const express = require("express");
const cors = require("cors");
const { frontendUrl, port } = require("./config/env");
const categoriesRoutes = require("./routes/categories.routes");
const dealsRoutes = require("./routes/deals.routes");
const healthRoutes = require("./routes/health.routes");
const popularRestaurantsRoutes = require(
  "./routes/popular-restaurants.routes",
);
const restaurantsRoutes = require("./routes/restaurants.routes");

const app = express();

app.use(
  cors({
    origin: frontendUrl,
  }),
);
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/api/deals", dealsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/popular-restaurants", popularRestaurantsRoutes);
app.use("/api/restaurants", restaurantsRoutes);

app.listen(port, () => {
  console.log(`dostavi.me API is running on port ${port}`);
});
