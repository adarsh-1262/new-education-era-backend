const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ExpertSchema = new mongoose.Schema({
  userType: { 
    type: String, 
    required: true, 
    enum: ['student', 'admin', 'subadmin', 'expert', 'tutor', 'parent'] // Specified user roles
  },
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true // Removes leading/trailing whitespace
  },
  email: { 
      type: String, 
      required: true, 
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'] // Email validation
  },
  password: { 
      type: String, 
      required: true,
      minlength: 6 // Minimum password length
  },
  phone: {
    type: Number,
    required: true,
    minlength: 10,
    maxlength: 10
  },
  consultationField: {
    type: String,
    required: true
  },
  experienceYears: {
    type: Number,
    required: true
  }
});

// Hash password before saving
ExpertSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
ExpertSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Expert', ExpertSchema);
