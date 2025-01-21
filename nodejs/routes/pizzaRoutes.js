const express = require("express");
const {
  createPizza,
  getPizzas,
  getPizzaById,
  updatePizza,
  deletePizza,
  createPizzasFromFile,
} = require("../controllers/pizzaController");

const router = express.Router();

router.post("/", createPizza);
router.get("/", getPizzas);
router.get("/:id", getPizzaById);
router.put("/:id", updatePizza);
router.delete("/:id", deletePizza);
router.post("/addPizzas", createPizzasFromFile);

module.exports = router;
