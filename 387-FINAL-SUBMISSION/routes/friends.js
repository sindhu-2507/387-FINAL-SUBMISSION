const path = require('path');
const express = require('express');

const adminCon = require('../controllers/admin');

const router = express.Router();


router.get('/',adminCon.get_friends_test);
router.post('/',adminCon.post_friends_test);


module.exports = router;