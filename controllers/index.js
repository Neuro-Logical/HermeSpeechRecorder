const { Router } = require('express');
const express = require('express');
const path = require('path');
const router = Router()
const { adminAuth } = require('../middleware/auth.js');

// add public static folder
router.use('/medias', express.static(path.join(__dirname, '../medias')));

router.use('/api/script', require('./script'));
router.use('/api/user', require('./user'));
router.use('/api/utterancedetail', require('./utterancedetail'));
router.use('/api/upload', require('./upload'))
router.use('/api/audios', adminAuth, require('./audios'))
router.use('/api/auth', require('./auth'))
router.use('/api/media', require('./media'))

module.exports = router;