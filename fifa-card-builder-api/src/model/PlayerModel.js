const mongoose = require('../config/database');

// Player model for FIFA-style cards (multi-sport)
// Stores the player's display name and a photo URL/path.
const PlayerSchema = new mongoose.Schema({
  playerId: {
    type: String,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  name: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Player = mongoose.model('Player', PlayerSchema);

module.exports = Player;
