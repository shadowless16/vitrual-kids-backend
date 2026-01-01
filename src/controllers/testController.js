const Test = require('../models/Test');

exports.createTest = async (req, res) => {
  try {
    const test = await Test.create({ ...req.body, createdBy: req.user.userId });
    res.status(201).json(test);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTests = async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'teacher') {
      query.createdBy = req.user.userId;
    }
    const tests = await Test.find(query).populate('createdBy', 'name email');
    res.json(tests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ error: 'Test not found' });
    
    // Authorization check
    if (req.user.role === 'teacher' && test.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(test);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateTest = async (req, res) => {
  try {
    let test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ error: 'Test not found' });

    if (req.user.role === 'teacher' && test.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    test = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(test);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ error: 'Test not found' });

    if (req.user.role === 'teacher' && test.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await test.deleteOne();
    res.json({ message: 'Test deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
