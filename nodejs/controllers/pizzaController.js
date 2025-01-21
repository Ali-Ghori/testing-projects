const Pizza = require("../models/piza");
const path = require("path");
const fs = require("fs");

exports.createPizza = async (req, res) => {
  try {
    const { name, size, price, quantity, date } = req.body;
    const pizza = new Pizza({ name, size, price, quantity, date });
    await pizza.save();
    res.status(201).json({ message: "Pizza created successfully", pizza });
  } catch (error) {
    res.status(500).json({ error: error.message || "Server error" });
  }
};

exports.createPizzasFromFile = async (req, res) => {
  try {
    const filePath = path.resolve(__dirname, "./data/pizzaData.json");
    console.log(filePath, "filePath");

    const pizzasData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    console.log(pizzasData, "pizzasData");

    if (!Array.isArray(pizzasData)) {
      return res
        .status(400)
        .json({ error: "Data is not in the correct format" });
    }

    const result = await Pizza.insertMany(pizzasData);
    res
      .status(201)
      .json({ message: "Pizzas created successfully", pizzas: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Server error" });
  }
};

exports.getPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find();
    res.status(200).json(pizzas);
  } catch (error) {
    res.status(500).json({ error: error.message || "Server error" });
  }
};

exports.getPizzaById = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) return res.status(404).json({ message: "Pizza not found" });
    res.status(200).json(pizza);
  } catch (error) {
    res.status(500).json({ error: error.message || "Server error" });
  }
};

exports.updatePizza = async (req, res) => {
  try {
    const { name, size, price, quantity, date } = req.body;
    const pizza = await Pizza.findByIdAndUpdate(
      req.params.id,
      { name, size, price, quantity, date },
      { new: true }
    );
    if (!pizza) return res.status(404).json({ message: "Pizza not found" });
    res.status(200).json({ message: "Pizza updated successfully", pizza });
  } catch (error) {
    res.status(500).json({ error: error.message || "Server error" });
  }
};

exports.deletePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findByIdAndDelete(req.params.id);
    if (!pizza) return res.status(404).json({ message: "Pizza not found" });
    res.status(200).json({ message: "Pizza deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Server error" });
  }
};
