const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name.'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email.'],
  },
  password: {
    type: String,
    required: [true, 'Please enter your password.'],
  },
  blogs: {
    type: Array,
    default: [],
  },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
