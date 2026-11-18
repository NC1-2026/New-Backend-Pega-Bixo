const express = require('express');
const router = express.Router();
const { createService } = require('../controllers/serviceController');
const { protectAdmin } = require('../middlewares/auth');

router.post('/', protectAdmin, createService);

module.exports = router;