const express = require('express');
const router = express.Router();
const { getMonth } = require('../../controllers/monthController');

router.get('/get', getMonth);

module.exports = router;