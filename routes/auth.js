const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    try {

        //extract all fields from request body
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
        }

        //check id user exists
        const existingUser = await User.findOne({email});
        if (existingUser) return res.status(400).json({ message: "User already exist"});
        
        //creates and saves new user
        const newUser = new User({ username, email, password });
        await newUser.save();

        //creates jwt token
        const token = jwt.sign(
          { id: newUser._id, username: newUser.username },
          process.env.JWT_SECRET, {expiresIn: '1d' }
        );

        res.status(201).json({
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    }); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create token
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;