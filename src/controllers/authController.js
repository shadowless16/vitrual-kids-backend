const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, schoolId, studentClass } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role, schoolId, studentClass });
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);
    res.status(201).json({ message: 'User registered successfully', token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error(`Registration error for ${req.body.email || 'unknown'}:`, error.message);
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.warn(`Failed login attempt for email: ${email}`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);
    console.log(`Login successful: ${email} (${user.role})`);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error(`Login error for ${req.body.email}:`, error.message);
    res.status(400).json({ error: error.message });
  }
};
