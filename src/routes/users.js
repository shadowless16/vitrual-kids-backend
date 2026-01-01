const express = require('express');
const router = express.Router();
const { getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/auth');

router.get('/', auth, getUsers);
router.get('/:id', auth, getUserById);
router.put('/:id', auth, checkRole(['admin']), updateUser);
router.delete('/:id', auth, checkRole(['admin']), deleteUser);

module.exports = router;
