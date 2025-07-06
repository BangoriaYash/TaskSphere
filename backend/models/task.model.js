const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  
  description: { type: String },

  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },

  status: {
    type: String,
    enum: ['to-do', 'in-progress', 'completed'],
    default: 'to-do'
  },

  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  
  project: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project', 
    required: true 
  }, // Related Project

  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }] // Array of Users (only employees)
  
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
