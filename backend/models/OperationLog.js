const mongoose = require('mongoose');

const OperationLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  performedBy: { type: String, required: true },
  role: { type: String, required: true },
  targetEntity: { type: String, default: '' },
  details: { type: Object, default: {} },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('OperationLog', OperationLogSchema);
