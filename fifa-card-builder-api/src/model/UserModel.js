const mongoose = require('../config/database');

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  nome: { type: String, required: true },
  login: { type: String, required: true, unique: true },
  senha: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;