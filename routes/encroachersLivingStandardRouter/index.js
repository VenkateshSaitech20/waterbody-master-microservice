const express = require('express');
const router = express.Router();
const { validateMiddleware } = require('../../middleware/validateMiddleware');
const { trimRequestBody } = require('../../middleware/trimMiddleware');
const { verifyToken } = require('../../middleware/verifyToken');
const { upsertData, getData, getDataById, deleteData } = require('../../controllers/encroachersLivingStandardController');
const encroachersLivingStandardModel = require('../../models/encroachersLivingStandardModel');

router.post('/', verifyToken, trimRequestBody, validateMiddleware(encroachersLivingStandardModel), upsertData);
router.post('/get', verifyToken, getData);
router.get('/:id', verifyToken, getDataById);
router.delete('/:id', verifyToken, deleteData);

module.exports = router;