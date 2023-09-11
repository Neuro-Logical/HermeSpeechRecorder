const { Router } = require('express');
const router = Router();
const ctrl = require('./media.ctrl');

const multer  = require('multer');
const fs = require('fs');
const path = require('path');

const uploadMedia = path.resolve(__dirname, '../../medias');

if (!fs.existsSync(uploadMedia)) {
    fs.mkdirSync(uploadMedia); 
}

const mediaStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'medias/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const uploadM = multer({ storage: mediaStorage });

router.post('/create', uploadM.single('filename'), ctrl.create_script);
router.post('/assign', ctrl.assign);
router.get('/get_all_medias', ctrl.get_all_medias);
router.post('/get_id',ctrl.get_id);
router.post('/unassign_task', ctrl.unassign_task);


module.exports = router;