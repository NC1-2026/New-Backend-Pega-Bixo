const express = require('express');
const userController = require('./user.controller');

const router = express.Router();

router.use(userController.requireAdmin);

module.exports = router;
