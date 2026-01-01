const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true }, // e.g., 'HTML', 'CSS', 'JavaScript'
  week: { type: Number }, // Week number
  topic: { type: String }, // Module/Topic name
  url: { type: String }, // External link (formerly 'link')
  type: { type: String, default: 'link' }, // 'document', 'video', 'link', 'project'
  status: { type: String, default: 'active' }, // 'active', 'inactive'
  content: { type: String }, // Short textual content
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resource', resourceSchema);
