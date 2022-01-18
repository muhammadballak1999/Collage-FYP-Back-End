var multer = require('multer');
const AppError = require('../utils/appError');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/i)) {

        return cb(new AppError('Only image files are allowed!'), 500);
    }

    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

exports.upload = upload.single('photo') ;