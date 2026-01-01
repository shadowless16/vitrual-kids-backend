const Result = require('../models/Result');

exports.submitResult = async (req, res) => {
  try {
    const result = await Result.create({ ...req.body, studentId: req.user.userId });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getResults = async (req, res) => {
  try {
    const results = await Result.find().populate('testId studentId');
    res.json(results);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id).populate('testId');
    if (!result) return res.status(404).json({ error: 'Result not found' });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
