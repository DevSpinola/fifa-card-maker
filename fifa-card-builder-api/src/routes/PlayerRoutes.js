const express = require('express');
const router = express.Router();
const PlayerController = require('../controller/PlayerController');
const PlayerValidation = require('../middlewares/PlayerValidation');

router.post('/', PlayerValidation, PlayerController.post);
router.put('/:id', PlayerValidation, PlayerController.update);
router.delete('/:id', PlayerController.delete);
router.get('/:id', PlayerController.get);
router.get('/', PlayerController.getAll);

module.exports = router;