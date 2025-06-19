const express = require("express");
const router = express.Router();
const Item = require("../models/item");

// Get all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch items" });
  }
});

// Add new item
router.post("/", async (req, res) => {
  try {
    const { name, quantity, category, price } = req.body;
    const newItem = new Item({
      name,
      quantity: parseInt(quantity), // important: convert to number
      category,
      price: parseFloat(price)
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: "Failed to add item" });
  }
});

// Decrease quantity by 1
router.put("/decrease/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.quantity > 0) {
      item.quantity -= 1;
      await item.save();
      return res.json(item);
    } else {
      return res.status(400).json({ message: "Item already out of stock" });
    }
  } catch (err) {
    console.error("Error in decrease:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update item
router.put("/:id", async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: "Failed to update item" });
  }
});

// Delete item
router.delete("/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete item" });
  }
});

module.exports = router;

