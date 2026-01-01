const express = require('express');
const router = express.Router();
const { create, getAll, getById, update, delete: remove } = require('../controllers/schoolController');
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/auth');

router.post('/', auth, checkRole(['admin']), create);
router.get('/', auth, getAll);
router.get('/:id', auth, getById);
router.put('/:id', auth, checkRole(['admin']), update);
router.delete('/:id', auth, checkRole(['admin']), remove);

module.exports = router;
