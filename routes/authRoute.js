const express = require('express');
const User = require('../models/userSchema');
const errorHandler = require('../middlewares/errorMiddleware');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: 'User already exist with this Email' });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exist
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: 'Email or password is incorrect.' });
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      res.status(400).json({ message: 'Email or password is incorrect.' });
    }

    // Create token
    const authToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '10m' }
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET_KEY,
      { expiresIn: '40m' }
    );

    // sent cookies
    res.cookie('authToken', authToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.status(200).json({
      message: 'Login Successfully',
    });
  } catch (error) {
    next(error);
  }
});

router.post('/send-otp', async (req, res, next) => {
  const { email } = req.body;
  const OTP = Math.floor(100000 + Math.random() * 900000);
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'OTP for Email Verification ✔',
      text: `Your OTP for Email Verification is ${OTP}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(400).json({ message: 'Something went wrong' });
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).json({ message: 'OTP sent successfully' });
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
