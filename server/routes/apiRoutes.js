const express = require('express');
const router = express.Router();
const masterController = require('../controllers/masterController');

// Rute untuk SPBU
router.get('/spbu', masterController.getSpbu);
router.post('/spbu', masterController.addSpbu);
router.delete('/spbu/:id', masterController.deleteSpbu);

// Rute untuk Operators
router.get('/operators', masterController.getOperators);
router.post('/operators', masterController.addOperator);
router.delete('/operators/:id', masterController.deleteOperator);

// Rute untuk Footers
router.get('/footers', masterController.getFooters);
router.post('/footers', masterController.addFooter);
router.delete('/footers/:id', masterController.deleteFooter);

module.exports = router;