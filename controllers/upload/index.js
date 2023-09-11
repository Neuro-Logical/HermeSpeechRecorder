const { Router } = require('express');
const multer  = require('multer');
const fs = require('fs');
const path = require('path');
const router = Router();

const uploadDir = path.resolve(__dirname, '../../uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir); 
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('filename'), (req, res) => {
    try {
        res.send(req.file);
    } catch(err) {
        res.send(400);
    }
});

module.exports = router;