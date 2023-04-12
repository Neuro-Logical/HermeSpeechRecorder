const { Router } = require('express');
// const { route } = require('../../app');
const router = Router();
const ctrl = require('./script.ctrl');

router.get('/', (_, res) => {
    res.send("Script")
});

router.post('/create', ctrl.create_script);
router.post('/findScriptID', ctrl.get_one_script_by_id);
router.post('/unassign_task', ctrl.unassign_task);
router.get('/getScriptNum', ctrl.get_script_total_number);

module.exports = router;