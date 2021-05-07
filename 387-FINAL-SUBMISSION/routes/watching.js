const path = require('path');
const express = require('express');

const wCon = require('../controllers/admin');

const router = express.Router();


router.get('/',wCon.get_watching_test);
router.post('/',wCon.post_watching_test);


module.exports = router;