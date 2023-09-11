const { Router } = require('express');
const router = Router();
const ctrl = require('./auth.ctrl');
const { adminAuth } = require('../../middleware/auth.js');

router.get('/admin', adminAuth, (_, res) => {
    res.send("AdminUser")
});

// router.post('/admin/register', ctrl.register);
router.post('/admin/login', ctrl.login);


module.exports = router;