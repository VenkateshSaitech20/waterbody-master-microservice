const express = require('express');
const router = express.Router();
const { validateMiddleware } = require('../../middleware/validateMiddleware');
const { trimRequestBody } = require('../../middleware/trimMiddleware');
const availabilityModel = require('../../models/availabilityModel');
const { upsertAvailability, getAvailability, getAvailabilityById, deleteAvailability } = require('../../controllers/availabilityController');
const { verifyToken } = require('../../middleware/verifyToken');

router.post('/', verifyToken, trimRequestBody, validateMiddleware(availabilityModel), upsertAvailability);
router.post('/get', verifyToken, getAvailability);
router.get('/:id', verifyToken, getAvailabilityById);
router.delete('/:id', verifyToken, deleteAvailability);

module.exports = router;