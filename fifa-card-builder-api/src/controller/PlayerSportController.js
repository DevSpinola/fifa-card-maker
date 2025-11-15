const PlayerSportModel = require('../model/PlayerSportModel');
const SportModel = require('../model/SportModel');
const PlayerModel = require('../model/PlayerModel');

class PlayerSportController {
  // Create a PlayerSport by merging sport defaults and validating values
  async create(req, res) {
    try {
      const { player, sport, attributes = {} } = req.body;

      // Validation moved to middleware `PlayerSportValidation`.
      // Controller assumes input is valid and only computes overall + saves.

      // use provided overall when present; otherwise compute simple average overall
      let overall;
      if (typeof req.body.overall !== 'undefined' && req.body.overall !== null) {
        overall = Math.round(Number(req.body.overall));
      } else {
        const vals = Object.values(attributes).map((v) => Number(v));
        overall = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
      }

      // create PlayerSport with provided attributes and overall
      const ps = new PlayerSportModel({ player, sport, attributes: attributes, overall });
      const saved = await ps.save();
      return res.status(201).json(saved);
    } catch (err) {
      // handle duplicate index for player+sport
      if (err && err.code === 11000) return res.status(400).json({ error: 'Player already has an entry for this sport' });
      return res.status(500).json({ error: err.message || err });
    }
  }

  async getAll(req, res) {
    try {
      const list = await PlayerSportModel.find().populate('player').populate('sport');
      return res.status(200).json(list);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

module.exports = new PlayerSportController();
