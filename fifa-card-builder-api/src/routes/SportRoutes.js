const express = require('express');
const router = express.Router();
const SportController = require('../controller/SportController');
const SportValidation = require('../middlewares/SportValidation');
const AuthMiddleware = require('../middlewares/AuthMiddleware'); // Importar

router.post('/', AuthMiddleware, SportValidation, SportController.post);
router.put('/:id', AuthMiddleware, SportValidation, SportController.update);
router.delete('/:id', AuthMiddleware, SportController.delete);

// Leitura protegida
router.get('/:id', AuthMiddleware, SportController.get);
router.get('/', AuthMiddleware, SportController.getAll);

module.exports = router;