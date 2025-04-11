const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'image') {
        const allowedImageTypes = /jpeg|jpg|png|gif/;
        const isValid = allowedImageTypes.test(path.extname(file.originalname).toLowerCase()) &&
                        allowedImageTypes.test(file.mimetype);
        return isValid ? cb(null, true) : cb(new Error('Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif)'));
    } 
    else if (file.fieldname === 'file') {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file PDF'));
        }
    } 
    else {
        cb(new Error('Trường file không hợp lệ'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, 
    fileFilter: fileFilter
}).fields([
    { name: 'image', maxCount: 1 }, 
    { name: 'file', maxCount: 1 }
]);

module.exports = upload;
