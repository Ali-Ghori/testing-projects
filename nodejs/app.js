require("dotenv").config();
const express = require("express");
const mongoose = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const pizzaRoutes = require("./routes/pizzaRoutes");
const { authenticateToken } = require("./middlewares/authMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use((req, res, next) => {
  const openRoutes = ["/api/auth/login", "/api/auth/signup"];
  if (openRoutes.includes(req.path)) {
    return next();
  }
  authenticateToken(req, res, next);
});

app.use("/api/auth", authRoutes);
app.use("/api/pizzas", pizzaRoutes);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
