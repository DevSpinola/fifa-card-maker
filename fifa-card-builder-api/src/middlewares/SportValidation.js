const SportModel = require('../model/SportModel');
const mongoose = require('mongoose');

async function SportValidation(req, res, next) {
  const { name, icon } = req.body;
  const isUpdate = !!req.params.id;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ error: 'Provide a valid name (at least 2 characters).' });
  }

  if (icon && typeof icon !== 'string') {
    return res.status(400).json({ error: 'icon must be a string (URL or data URI).' });
  }

  if (isUpdate) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ error: 'Invalid id format.' });

    const exists = (await SportModel.countDocuments({ _id: req.params.id })) >= 1;
    if (!exists) return res.status(404).json({ error: 'Sport not found' });
  }

  return next();
}

module.exports = SportValidation;
