const express = require('express');
const router = express.Router();
const CardController = require('../controller/CardController');
const CardValidation = require('../middlewares/CardValidation');

router.post('/', CardValidation, CardController.create);
router.get('/', CardController.getAll);

module.exports = router;
