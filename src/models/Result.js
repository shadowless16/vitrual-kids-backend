const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{ questionId: String, answer: Number }],
  score: { type: Number, required: true },
  timeSpent: { type: Number }, // in seconds
  violations: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', resultSchema);
