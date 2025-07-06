const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
// router.get('/users', authMiddleware('admin'), authController.getUsers);
// router.put('/users/role', authMiddleware('admin'), authController.updateRole);

module.exports = router;
