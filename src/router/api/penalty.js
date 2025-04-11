const express = require('express');
const penaltyController = require('../../controllers/api/penaltyController');
const router = express.Router();

router.get('/', penaltyController.getAll);
router.post('/', penaltyController.addPenalty);
router.put('/:id', penaltyController.updateStatus);

module.exports = router;