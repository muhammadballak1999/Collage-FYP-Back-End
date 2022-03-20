const router = require('express').Router();
const user = require('../controllers/user');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const verify_token = require('../middlewares/verify-token');
const { admin } = require('../utils/roles');
const photo = require('../middlewares/multer');
const { authorization } = require('../middlewares/authorization');
const { UserValidators } =  require("../middlewares/validator");
const Validator = require("../middlewares/validator/validator");

router.get('/all-users', verify_token, authorization([admin]), user.get);
router.get('/users/:keyword', verify_token, authorization([admin]), user.getUsers);
router.get('/user/:id', verify_token, authorization([admin]), user.getOne);
router.get('/users/admins/:keyword', verify_token, authorization([admin]), user.getAdmins);
router.get('/users/police-stations/:keyword', verify_token, authorization([admin]), user.getPoliceStations);
router.post('/users', verify_token, authorization([admin]), Validator(UserValidators.create), user.create);
router.put('/users/:id', verify_token, authorization([admin]), Validator(UserValidators.update), user.update);
router.delete('/users/:id', verify_token, authorization([admin]), user.delete);

module.exports = router;