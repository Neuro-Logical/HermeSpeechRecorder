const { Router } = require('express');
const router = Router()

router.get('/', (_, res) => {
    res.send("Welcome to AtypicalSpeech")
});

router.use('/script', require('./script'));
router.use('/user', require('./user'));
router.use('/utterancedetail', require('./utterancedetail'));

module.exports = router;