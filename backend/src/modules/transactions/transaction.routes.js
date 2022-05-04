const express = require('express');
const controller = require('./transaction.controller');
const authController = require('../users/auth.controller');
const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect());

router.get('/me', controller.list());
router.post('/transfer', controller.transfer());
router.post('/confirm', controller.confirm());

module.exports = router;
