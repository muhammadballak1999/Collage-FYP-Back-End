const router = require('express').Router();
const user = require('../controllers/user');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const verify_token = require('../middlewares/verify-token');
const photo = require('../middlewares/multer');


router.post('/user', user.create);
router.get('/user', user.get);

module.exports = router;