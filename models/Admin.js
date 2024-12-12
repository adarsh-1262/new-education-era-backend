const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
  userType: { 
    type: String, 
    required: true, 
    enum: ['student', 'admin', 'subadmin', 'expert', 'tutor', 'parent'] // Specified user roles
  },
  name:{
    type: String,
    required: true,
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
  profilePicture: { 
    type: String, 
    required: true 
  },
});

// Hash password before saving
AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
AdminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', AdminSchema);
