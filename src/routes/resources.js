const express = require('express');
const router = express.Router();
const { create, getAll, getById, update, delete: remove } = require('../controllers/resourceController');
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/auth');

router.post('/', auth, checkRole(['teacher', 'admin']), create);
router.get('/', auth, getAll);
router.get('/:id', auth, getById);
router.put('/:id', auth, checkRole(['teacher', 'admin']), update);
router.delete('/:id', auth, checkRole(['teacher', 'admin']), remove);

module.exports = router;
