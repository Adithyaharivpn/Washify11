const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  ename: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  role: { 
    type: String, 
    enum: ['user', 'admin', 'owner'],
    default: 'user'
  },
  phone: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true 
});


userSchema.index({ ename: 1 });

module.exports = mongoose.model('User', userSchema);