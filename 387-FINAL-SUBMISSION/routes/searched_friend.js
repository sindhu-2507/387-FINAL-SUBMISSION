const path = require('path');
const express = require('express');

const adminCon = require('../controllers/admin');

const router = express.Router();


router.get('/',adminCon.get_searched_friend_test);
router.post('/',adminCon.post_searched_friend_test);


module.exports = router;
