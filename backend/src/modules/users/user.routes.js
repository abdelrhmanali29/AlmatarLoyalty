const express = require('express');
const authController = require('./auth.controller');
const controller = require('./user.controller');
const transactionsRouter = require('../transactions/transaction.routes');
const router = express.Router({ mergeParams: true });

router.post('/signup', authController.signup());
router.post('/login', authController.login());
router.get('/logout', authController.logout());

// Protect all routes after this middleware
router.use(authController.protect());

router.get('/me', controller.getMe(), controller.getById());

module.exports = router;
