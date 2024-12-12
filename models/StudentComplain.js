const mongoose = require('mongoose');

const StudentComplain = new mongoose.Schema({
  studentName: { 
    type: String, 
    required: true, 
  },
  subject: { 
    type: String, 
    required: true, 
  },
  class: { 
      type: String, 
      required: true, 
  },
  complaintType: { 
      type: String, 
      required: true
  },
  message: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('StudentComplain', StudentComplain);