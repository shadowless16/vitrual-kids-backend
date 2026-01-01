const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  duration: { type: Number, required: true },
  questions: [{
    question: String,
    options: [String],
    correctAnswer: Number
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Test', testSchema);
