const express = require('express');
const router = express.Router();
const { submitResult, getResults, getResultById } = require('../controllers/resultController');
const auth = require('../middleware/auth');

router.post('/', auth, submitResult);
router.get('/', auth, getResults);
router.get('/:id', auth, getResultById);

module.exports = router;
