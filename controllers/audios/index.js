const { Router } = require('express');
const router = Router();
const ctrl = require('./audios.ctrl');

router.get('/', (_, res) => {
    res.send("Audios")
});

router.get('/get_all_audios', ctrl.get_all_audios);
router.post('/download_single_audio', ctrl.download_single_audio);

module.exports = router;