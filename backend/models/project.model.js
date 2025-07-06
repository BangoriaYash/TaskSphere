const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },

  description: { type: String }, // new field
  startDate: { type: Date, required: true }, // new field
  endDate: { type: Date, required: true },   // new field

  status: {
    type: String,
    enum: ['ongoing', 'expired'],
    default: 'ongoing'
  },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['admin', 'leader', 'employee'], default: 'employee' }
  }]
}, {
  timestamps: true
});


//  Then export your model
module.exports = mongoose.model('Project', projectSchema);
