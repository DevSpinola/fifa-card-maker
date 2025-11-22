const CardModel = require('../model/CardModel');
const SportModel = require('../model/SportModel');
const PlayerModel = require('../model/PlayerModel');

class CardController {
  // Create a Card by merging sport defaults and validating values
  async create(req, res) {
    try {
      const { player, sport, position, attributes = {} } = req.body;

      // Validation moved to middleware `CardValidation`.
      // Controller assumes input is valid and only computes overall + saves.

      // use provided overall when present; otherwise compute simple average overall
      let overall;
      if (typeof req.body.overall !== 'undefined' && req.body.overall !== null) {
        overall = Math.round(Number(req.body.overall));
      } else {
        const vals = Object.values(attributes).map((v) => Number(v));
        overall = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
      }

      // create Card with provided attributes and overall
      const card = new CardModel({ player, sport, position, attributes: attributes, overall });
      const saved = await card.save();
      return res.status(201).json(saved);
    } catch (err) {
      // handle duplicate index for player+sport
      if (err && err.code === 11000) return res.status(400).json({ error: 'Player already has an entry for this sport' });
      return res.status(500).json({ error: err.message || err });
    }
  }

  async getAll(req, res) {
    try {
      const list = await CardModel.find().populate('player').populate('sport');
      return res.status(200).json(list);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

module.exports = new CardController();
