const express = require('express');
const cors = require('cors')
const app = express();
app.use(express.json());
app.use(cors());
require('dotenv').config();
const setCSPHeaders = require('./middleware/csp-middleware');
app.use(setCSPHeaders);
const PORT = process.env.PORT || 4000;

const apiRouter = require('./apiRouter');
app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log("App is running on port : ", PORT);
})