const express = require('express');
const router = express.Router();

const sensor = require('./sensor/index');

router.use('/sensor', sensor);


module.exports = router;