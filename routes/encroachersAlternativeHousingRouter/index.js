const express = require('express');
const router = express.Router();
const { validateMiddleware } = require('../../middleware/validateMiddleware');
const { trimRequestBody } = require('../../middleware/trimMiddleware');
const { verifyToken } = require('../../middleware/verifyToken');
const { upsertData, getData, getDataById, deleteData } = require('../../controllers/encroachersAlternativeHousingController');
const encroachersAlternativeHousingModel = require('../../models/encroachersAlternativeHousingModel');

router.post('/', verifyToken, trimRequestBody, validateMiddleware(encroachersAlternativeHousingModel), upsertData);
router.post('/get', verifyToken, getData);
router.get('/:id', verifyToken, getDataById);
router.delete('/:id', verifyToken, deleteData);

module.exports = router;