const express = require('express');
const router = express.Router();
const CardController = require('../controller/CardController');
const CardValidation = require('../middlewares/CardValidation');
const AuthMiddleware = require('../middlewares/AuthMiddleware'); // Importar

// Adicione AuthMiddleware antes do Controller para proteger a rota
router.post('/', AuthMiddleware, CardValidation, CardController.create);
router.put('/:id', AuthMiddleware, CardValidation, CardController.update);
router.delete('/:id', AuthMiddleware, CardController.delete);

// Se quiser que apenas usuários logados vejam os cards, adicione aqui também:
router.get('/', AuthMiddleware, CardController.getAll);
router.get('/:id', AuthMiddleware, CardController.getById);

module.exports = router;