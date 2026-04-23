const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole } = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require admin access
router.use(authenticate, authorize('admin'));

router.get('/', getUsers);
router.patch('/:id/role', updateUserRole);

module.exports = router;
