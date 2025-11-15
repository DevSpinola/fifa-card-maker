const PlayerModel = require("../model/PlayerModel");

class PlayerController {
  async getAll(req, res) {
    try {
      const players = await PlayerModel.find();
      return res.status(200).json(players);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async get(req, res) {
    try {
      const player = await PlayerModel.findById(req.params.id);
      if (!player) return res.status(404).json({ message: "Player not found" });
      return res.status(200).json(player);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async post(req, res) {
    try {
      const player = new PlayerModel(req.body);
      const saved = await player.save();
      return res.status(201).json(saved);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async update(req, res) {
    try {
      const updated = await PlayerModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ message: "Player not found" });
      return res.status(200).json(updated);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async delete(req, res) {
    try {
      const deleted = await PlayerModel.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Player not found" });
      return res.status(200).json(deleted);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}

module.exports = new PlayerController();
