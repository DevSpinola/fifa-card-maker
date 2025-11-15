const mongoose = require('../config/database');

// Sport model - contains a unique sportId, the sport name and an icon
const SportSchema = new mongoose.Schema({
  sportId: {
    type: String,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  // Icon URL or base64/icon path
  icon: {
    type: String
  },
  // Definitions for attributes (for UI and validation)
  attributeDefs: {
    type: [new mongoose.Schema({
      key: { type: String, required: true },
      label: { type: String },
      min: { type: Number, default: 0 },
      max: { type: Number, default: 100 },
      default: { type: Number, default: 0 }
    }, { _id: false })],
    default: []
  },
  
}, { timestamps: true });

const Sport = mongoose.model('Sport', SportSchema);

module.exports = Sport;
