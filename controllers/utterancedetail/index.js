const { Router } = require('express');
const router = Router();
const ctrl = require('./utterancedetail.ctrl');

router.get('/', (_, res) => {
    res.send("Utterance Detail")
});

// router.get('/get_total_user', ctrl.get_total_user_num);

router.post('/create_utterance_detail', ctrl.create_utterance_detail);


module.exports = router;