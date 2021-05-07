const path = require('path');
const express = require('express');

const adminCon = require('../controllers/admin');

const router = express.Router();


router.get('/',adminCon.get_home_test);
router.post('/',adminCon.post_home_test);


module.exports = router;
