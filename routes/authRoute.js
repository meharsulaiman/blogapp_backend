const express = require('express');
const User = require('../models/userSchema');

const router = express.Router();

router.get('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: 'User already exist with this Email' });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
