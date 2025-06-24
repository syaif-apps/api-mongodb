const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define a simple Mongoose Schema and Model
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  quantity: {
    type: Number,
    default: 0
  }
});

const Item = mongoose.model('Item', itemSchema);

// --- API Endpoints for /api/items ---

// GET all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET one item
router.get('/:id', getItem, (req, res) => {
  res.json(res.item);
});

// POST a new item
router.post('/', async (req, res) => {
  const item = new Item({
    name: req.body.name,
    description: req.body.description,
    quantity: req.body.quantity
  });

  try {
    const newItem = await item.save();
    res.status(201).json(newItem); // 201 Created
  } catch (err) {
    res.status(400).json({ message: err.message }); // 400 Bad Request
  }
});

// PUT/PATCH (Update) one item
router.patch('/:id', getItem, async (req, res) => {
  if (req.body.name != null) {
    res.item.name = req.body.name;
  }
  if (req.body.description != null) {
    res.item.description = req.body.description;
  }
  if (req.body.quantity != null) {
    res.item.quantity = req.body.quantity;
  }
  try {
    const updatedItem = await res.item.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE one item
router.delete('/:id', getItem, async (req, res) => {
  try {
    await res.item.deleteOne(); // Use deleteOne() instead of remove()
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get item by ID
async function getItem(req, res, next) {
  let item;
  try {
    item = await Item.findById(req.params.id);
    if (item == null) {
      return res.status(404).json({ message: 'Cannot find item' }); // 404 Not Found
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.item = item;
  next(); // Move to the next middleware or route handler
}

module.exports = router;