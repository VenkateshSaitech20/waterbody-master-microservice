const express = require('express');
const router = express.Router();
const { validateMiddleware } = require('../../middleware/validateMiddleware');
const { trimRequestBody } = require('../../middleware/trimMiddleware');
const evictionSurplusCourseStatusModel = require('../../models/evictionSurplusCourseStatusModel');
const { upsertData, getData, getDataById, deleteData } = require('../../controllers/evictionSurplusCourseStatusController');
const { verifyToken } = require('../../middleware/verifyToken');

router.post('/', verifyToken, trimRequestBody, validateMiddleware(evictionSurplusCourseStatusModel), upsertData);
router.post('/get', verifyToken, getData);
router.get('/:id', verifyToken, getDataById);
router.delete('/:id', verifyToken, deleteData);

module.exports = router;