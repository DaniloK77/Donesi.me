const express = require("express");
const cors = require("cors");
const { frontendUrl, port } = require("./config/env");
const dealsRoutes = require("./routes/deals.routes");
const healthRoutes = require("./routes/health.routes");

const app = express();

app.use(
  cors({
    origin: frontendUrl,
  }),
);
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/api/deals", dealsRoutes);

app.listen(port, () => {
  console.log(`dostavi.me API is running on port ${port}`);
});
