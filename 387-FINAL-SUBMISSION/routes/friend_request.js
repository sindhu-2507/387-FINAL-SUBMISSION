const path = require('path');
const express = require('express');

const wCon = require('../controllers/admin');

const router = express.Router();


router.get('/',wCon.get_friend_request_test);
router.post('/',wCon.post_friend_request_test);


module.exports = router;