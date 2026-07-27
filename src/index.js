const express = require("express");
const cors = require("cors");
const { port } = require("./config/env");
const healthRoutes = require("./routes/health.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/health", healthRoutes);

app.listen(port, () => {
  console.log(`dostavi.me API is running on port ${port}`);
});

