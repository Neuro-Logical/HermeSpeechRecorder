const { Router } = require('express');
const router = Router();
const ctrl = require('./user.ctrl');

router.get('/', (_, res) => {
    res.send("User")
});

router.get('/get_total_user', ctrl.get_total_user_num);
router.get('/get_all_users', ctrl.get_all_users);
router.post('/get_user_by_id', ctrl.get_user_by_id);

router.post('/assign_task', ctrl.assign_task_to_user);
router.post('/assign_multiple_tasks', ctrl.assign_multiple_tasks);
router.post('/assign_mandatory_scripts', ctrl.assign_mandatory_scripts);
router.post('/mark_task_complete', ctrl.mark_task_complete);
router.post('/create', ctrl.create_user);
router.post('/get_assigned_tasks', ctrl.fetch_assigned_tasks_per_user);
router.post('/update_task_progress', ctrl.update_task_progress);
router.post('/delete_user', ctrl.delete_user);


module.exports = router;