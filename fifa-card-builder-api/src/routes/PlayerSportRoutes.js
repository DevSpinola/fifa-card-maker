const express = require('express');
const router = express.Router();
const PlayerSportController = require('../controller/PlayerSportController');
const PlayerSportValidation = require('../middlewares/PlayerSportValidation');

router.post('/', PlayerSportValidation, PlayerSportController.create);
router.get('/', PlayerSportController.getAll);

module.exports = router;
