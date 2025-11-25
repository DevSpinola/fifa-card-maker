const UserModel = require("../model/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");

class UserController {
  
  // --- LOGIN (Gerar Token) ---
  async login(req, res) {
    const { login, senha } = req.body;

    // 1. Verificar se usuário existe
    const user = await UserModel.findOne({ login });
    if (!user) {
      return res.status(400).json({ erro: "Usuário ou senha incorretos" });
    }

    // 2. Verificar se a senha bate (Descriptografa e compara)
    const checkPassword = await bcrypt.compare(senha, user.senha);
    if (!checkPassword) {
      return res.status(400).json({ erro: "Usuário ou senha incorretos" });
    }

    // 3. Gerar Token JWT
    const { id, nome } = user;
    const token = jwt.sign({ id, nome }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    return res.json({ user: { id, nome, login }, token });
  }

  // --- CRIAR USUÁRIO (Com Criptografia) ---
  async post(req, res) {
    const { id, nome, login, senha } = req.body;

    // Verificar se já existe
    const userExists = await UserModel.findOne({ login });
    if (userExists) {
      return res.status(400).json({ erro: "Login já cadastrado" });
    }

    // Criptografar a senha
    const passwordHash = await bcrypt.hash(senha, 8);

    const User = new UserModel({
      id,
      nome,
      login,
      senha: passwordHash, // Salva o hash, não a senha pura
    });

    await User.save()
      .then((response) => {
        // Não retornar a senha no json de resposta
        response.senha = undefined;
        return res.status(201).json(response);
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  }

  // --- OUTROS MÉTODOS (CRUD Padrão) ---
  async getAll(req, res) {
    await UserModel.find()
      .select('-senha') // Oculta a senha na listagem
      .then((response) => res.status(200).json(response))
      .catch((error) => res.status(500).json(error));
  }

  async get(req, res) {
    await UserModel.findOne({ id: req.params.id })
      .select('-senha')
      .then((response) => res.status(200).json(response))
      .catch((error) => res.status(500).json(error));
  }

  async update(req, res) {
    // Se for atualizar senha, precisaria criptografar de novo aqui.
    // Para simplificar, vamos impedir atualização de senha nesta rota ou assumir que vem hash.
    await UserModel.findOneAndUpdate({ id: req.params.id }, req.body, { new: true })
      .then((response) => res.status(200).json(response))
      .catch((error) => res.status(500).json(error));
  }

  async delete(req, res) {
    await UserModel.findOneAndDelete({ id: req.params.id })
      .then((response) => res.status(200).json(response))
      .catch((error) => res.status(500).json(error));
  }
}

module.exports = new UserController();