const path = require('path');
const express = require('express');

const adminCon = require('../controllers/admin');

const router = express.Router();


router.get('/',adminCon.get_profile_test);
router.post('/',adminCon.post_profile_test);


module.exports = router;
