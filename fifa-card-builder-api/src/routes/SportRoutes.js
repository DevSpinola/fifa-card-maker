const express = require('express');
const router = express.Router();
const SportController = require('../controller/SportController');
const SportValidation = require('../middlewares/SportValidation');

router.post('/', SportValidation, SportController.post);
router.put('/:id', SportValidation, SportController.update);
router.delete('/:id', SportController.delete);
router.get('/:id', SportController.get);
router.get('/', SportController.getAll);

module.exports = router;
