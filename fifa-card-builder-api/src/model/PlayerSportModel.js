const mongoose = require("../config/database");

// Relationship model linking a Player to a Sport with sport-specific data
const PlayerSportSchema = new mongoose.Schema(
  {
    playerSportId: {
      type: String,
      unique: true,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    sport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sport",
      required: true,
    },
    // Optional fields for a specific card: position and extra attributes
    position: {
      type: String,
      trim: true,
    },
    overall: {
      type: Number,
      min: 0,
      max: 100,
    },
    attributes: {
      type: Object,
    },
  },
  { timestamps: true }
);

// Ensure one Player-Sport pair is unique (a player shouldn't have duplicate entries for the same sport)
PlayerSportSchema.index({ player: 1, sport: 1 }, { unique: true });

const PlayerSport = mongoose.model("PlayerSport", PlayerSportSchema);

module.exports = PlayerSport;
