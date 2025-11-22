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

  async getById(req, res) {
    try {
      const { id } = req.params;
      const card = await CardModel.findById(id).populate('player').populate('sport');
      if (!card) return res.status(404).json({ error: 'Card not found' });
      return res.status(200).json(card);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { player, sport, position, attributes = {}, overall: manualOverall } = req.body;

      // Recalculate overall if attributes are present
      let overall = manualOverall;
      if (typeof manualOverall === 'undefined' || manualOverall === null) {
         if (Object.keys(attributes).length > 0) {
            const vals = Object.values(attributes).map((v) => Number(v));
            overall = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
         }
      }

      const updateData = { player, sport, position, attributes };
      if (overall !== undefined) updateData.overall = overall;

      const card = await CardModel.findByIdAndUpdate(id, updateData, { new: true }).populate('player').populate('sport');
      if (!card) return res.status(404).json({ error: 'Card not found' });
      return res.status(200).json(card);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const card = await CardModel.findByIdAndDelete(id);
      if (!card) return res.status(404).json({ error: 'Card not found' });
      return res.status(200).json({ message: 'Card deleted successfully' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new CardController();
