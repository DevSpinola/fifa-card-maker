const SportModel = require('../model/SportModel');

class SportController {
  async getAll(req, res) {
    try {
      const list = await SportModel.find();
      return res.status(200).json(list);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async get(req, res) {
    try {
      const sport = await SportModel.findById(req.params.id);
      if (!sport) return res.status(404).json({ error: 'Sport not found' });
      return res.status(200).json(sport);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async post(req, res) {
    try {
      const sport = new SportModel(req.body);
      const saved = await sport.save();
      return res.status(201).json(saved);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async update(req, res) {
    try {
      const updated = await SportModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ error: 'Sport not found' });
      return res.status(200).json(updated);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async delete(req, res) {
    try {
      const deleted = await SportModel.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Sport not found' });
      return res.status(200).json(deleted);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

module.exports = new SportController();
