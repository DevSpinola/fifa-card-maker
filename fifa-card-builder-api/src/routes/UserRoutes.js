const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController');
const UserValidation = require('../middlewares/UserValidation');
const AuthMiddleware = require('../middlewares/AuthMiddleware');

// Rota de Login (Pública)
router.post('/login', UserController.login);

// Cadastro de Usuário (Pública - ou proteja se apenas admin puder criar)
router.post('/', UserValidation, UserController.post);

// Rotas Protegidas (Exigem Token JWT)
// Exemplo: Para ver todos os usuários, precisa estar logado
router.get('/', AuthMiddleware, UserController.getAll);
router.get('/:id', AuthMiddleware, UserController.get);
router.put('/:id', AuthMiddleware, UserValidation, UserController.update);
router.delete('/:id', AuthMiddleware, UserController.delete);

module.exports = router;