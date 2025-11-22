const express = require('express');
const router = express.Router();
const CardController = require('../controller/CardController');
const CardValidation = require('../middlewares/CardValidation');

router.post('/', CardValidation, CardController.create);
router.get('/', CardController.getAll);
router.get('/:id', CardController.getById);
router.put('/:id', CardValidation, CardController.update);
router.delete('/:id', CardController.delete);

module.exports = router;
