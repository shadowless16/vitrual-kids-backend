const Resource = require('../models/Resource');
const User = require('../models/User');

exports.create = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const resourceData = {
      ...req.body,
      createdBy: req.user.userId,
      schoolId: user?.schoolId,
      // Admins can create global resources, teachers' resources are always school-scoped
      scope: req.user.role === 'admin' ? (req.body.scope || 'global') : 'school'
    };
    const resource = await Resource.create(resourceData);
    res.status(201).json(resource);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    let query = {};

    if (req.user.role === 'admin') {
      // Admins see everything
      query = {};
    } else if (req.user.role === 'teacher' || req.user.role === 'student') {
      // Teachers and students see global resources OR resources from their own school
      query = {
        $or: [
          { scope: 'global' },
          { schoolId: user.schoolId }
        ]
      };
    }

    const resources = await Resource.find(query).populate('createdBy', 'name role');
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    res.json(resource);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
