const express = require('express');
const router = express.Router();
const PlayerController = require('../controller/PlayerController');
const PlayerValidation = require('../middlewares/PlayerValidation');
const AuthMiddleware = require('../middlewares/AuthMiddleware'); // Importar

router.post('/', AuthMiddleware, PlayerValidation, PlayerController.post);
router.put('/:id', AuthMiddleware, PlayerValidation, PlayerController.update);
router.delete('/:id', AuthMiddleware, PlayerController.delete);

// Leitura protegida (opcional, pode remover o AuthMiddleware se quiser público)
router.get('/:id', AuthMiddleware, PlayerController.get);
router.get('/', AuthMiddleware, PlayerController.getAll);

module.exports = router;