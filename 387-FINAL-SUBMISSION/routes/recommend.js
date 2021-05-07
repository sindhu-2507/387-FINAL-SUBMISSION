const path = require('path');
const express = require('express');

const Con = require('../controllers/admin');

const router = express.Router();

router.get('/',Con.get_watched_test);
router.post('/',Con.post_watched_test);

module.exports = router;
