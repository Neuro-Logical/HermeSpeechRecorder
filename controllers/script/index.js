const { Router } = require('express');
// const { route } = require('../../app');
const router = Router();
const ctrl = require('./script.ctrl');

router.get('/', (_, res) => {
    res.send("Script")
});

router.post('/create', ctrl.create_script);
router.post('/delete_script', ctrl.delete_script);
router.post('/findScriptID', ctrl.get_one_script_by_id);
router.post('/unassign_task', ctrl.unassign_task);
router.post('/assign_task_to_multiple_users', ctrl.assign_task_to_multiple_users);
router.post('/update_assigned_task', ctrl.update_assigned_task);

router.post('/process_script', ctrl.process_script);

router.get('/getScriptNum', ctrl.get_script_total_number);
router.get('/get_all_scripts', ctrl.get_all_scripts);
router.get('/get_all_script_ids', ctrl.get_all_script_ids);

router.put('/update_script', ctrl.update_script);
router.put('/add_utterances', ctrl.add_utterances);
router.put('/update_script_line', ctrl.update_script_line);

module.exports = router;