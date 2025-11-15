const PlayerModel = require('../model/PlayerModel');
const SportModel = require('../model/SportModel');
const mongoose = require('mongoose');

async function PlayerSportValidation(req, res, next) {
  const { player, sport, attributes } = req.body;

  if (!player) return res.status(400).json({ error: 'player is required' });
  if (!sport) return res.status(400).json({ error: 'sport is required' });

  if (!attributes || typeof attributes !== 'object' || Array.isArray(attributes)) {
    return res.status(400).json({ error: 'Attributes object is required.' });
  }

  const keys = Object.keys(attributes);
  if (keys.length < 3 || keys.length > 6) {
    return res.status(400).json({ error: 'Attributes must contain between 3 and 6 items.' });
  }

  // validate numeric and range 0..100 for each attribute (do not mutate values)
  for (const [k, raw] of Object.entries(attributes)) {
    const num = Number(raw);
    if (Number.isNaN(num)) return res.status(400).json({ error: `Attribute ${k} is not a number` });
    if (num < 0 || num > 100) return res.status(400).json({ error: `Attribute ${k} must be between 0 and 100` });
  }

  // optional overall provided by client: validate if present
  if (typeof req.body.overall !== 'undefined' && req.body.overall !== null) {
    const ov = Number(req.body.overall);
    if (Number.isNaN(ov)) return res.status(400).json({ error: 'overall is not a number' });
    if (ov < 0 || ov > 100) return res.status(400).json({ error: 'overall must be between 0 and 100' });
  }

  // validate ids format
  if (!mongoose.Types.ObjectId.isValid(player)) return res.status(400).json({ error: 'Invalid player id format' });
  if (!mongoose.Types.ObjectId.isValid(sport)) return res.status(400).json({ error: 'Invalid sport id format' });

  // ensure player and sport exist
  const [playerExists, sportExists] = await Promise.all([
    PlayerModel.findById(player).select('_id'),
    SportModel.findById(sport).select('_id')
  ]);

  if (!playerExists) return res.status(404).json({ error: 'Player not found' });
  if (!sportExists) return res.status(404).json({ error: 'Sport not found' });

  return next();
}

module.exports = PlayerSportValidation;
