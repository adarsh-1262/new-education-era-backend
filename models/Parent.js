const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ParentSchema = new mongoose.Schema({
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
  school: {
    type: String,
    required: true,
    enum: [
        'Springfield High School', 
        'Riverdale Academy', 
        'Greenwood International', 
        'Maple Leaf School', 
        'Harmony Public School', 
        'Evergreen Valley Academy', 
        'Starlight High', 
        'Bluebell International', 
        'Hillcrest Academy', 
        'Crescent Public School'
    ] // Dummy list of school names
  },
  Class: {
        type: String,
        required: true,
        enum: ['Nur', 'KG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], // Classes from Nur to 12th
  },
  rollNo: {
        type: Number,
        required: true,
        min: 1, // Ensures roll number is positive
        validate: {
            validator: Number.isInteger,
            message: 'Roll number must be an integer'
        },
        unique: true
  },
  profilePicture: { 
    type: String, 
    required: true 
  },
});

// Hash password before saving
ParentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
ParentSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Parent', ParentSchema);
