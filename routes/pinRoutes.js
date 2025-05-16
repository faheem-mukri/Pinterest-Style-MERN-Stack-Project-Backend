const express = require('express');
const router = express.Router();
const Pin = require('../models/Pin');

// Create Pin
router.post('/', async (req, res) => {
    try{
        const { title, desc, imageUrl, user, tags } = req.body;
        const pin =  new Pin({ title, desc, imageUrl, user, tags });
        const savedPin = await pin.save();
        res.status(201).json(savedPin);
    } catch (err) {
        console.error('Pin Route Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get All Pins

router.get('/', async (req, res) => {
    try{
        const pins = await Pin.find().populate('user', 'username avatar').sort({ createdAt: -1 });
        res.json(pins);
    } catch (err) {
       console.error('Pin Route Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get Pin by ID
router.get('/:id', async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id).populate('user', 'username avatar');
    if (!pin) return res.status(404).json({ message: 'Pin not found' });
    res.json(pin);
  } catch (err) {
    console.error('Pin Route Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update Pin
router.put('/:id', async (req, res) => {
  try {
    const updatedPin = await Pin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPin) return res.status(404).json({ message: 'Pin not found' });
    res.json(updatedPin);
  } catch (err) {
    console.error('Pin Route Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete Pin
router.delete('/:id', async (req, res) => {
  try {
    const deletedPin = await Pin.findByIdAndDelete(req.params.id);
    if (!deletedPin) return res.status(404).json({ message: 'Pin not found' });
    res.json({ message: 'Pin deleted' });
  } catch (err) {
    console.error('Pin Route Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;