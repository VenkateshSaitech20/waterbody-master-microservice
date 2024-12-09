
const express = require('express');
const router = express.Router();
const { validateMiddleware } = require('../../middleware/validateMiddleware');
const { trimRequestBody } = require('../../middleware/trimMiddleware');
const { upsertData, getData, getDataById, deleteData } = require('../../controllers/retainingWallConditionController');
const { verifyToken } = require('../../middleware/verifyToken');
const retainingWallConditionModel = require('../../models/retainingWallConditionModel');

router.post('/', verifyToken, trimRequestBody, validateMiddleware(retainingWallConditionModel), upsertData);
router.post('/get', verifyToken, getData);
router.get('/:id', verifyToken, getDataById);
router.delete('/:id', verifyToken, deleteData);

module.exports = router;