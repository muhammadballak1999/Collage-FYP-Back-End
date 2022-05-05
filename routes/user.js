const router = require('express').Router();
const user = require('../controllers/user');
const verify_token = require('../middlewares/verify-token');
const { admin, police } = require('../utils/roles');
const role = require('../utils/roles');
// const photo = require('../middlewares/multer');
const { authorization } = require('../middlewares/authorization');
const { UserValidators } =  require("../middlewares/validator");
const Validator = require("../middlewares/validator/validator");
const photo = require('../middlewares/multer');

router.get('/all-users', verify_token, authorization([admin]), user.get);
router.get('/users/:keyword', verify_token, authorization([admin]), user.getUsers);
router.get('/me', verify_token, authorization([admin, role.user, police]), user.getMe);
router.put('/me', verify_token, authorization([admin, role.user, police]), user.updateMe);
router.get('/user/:id', verify_token, authorization([admin]), user.getOne);
router.get('/users/admins/:keyword', verify_token, authorization([admin]), user.getAdmins);
router.get('/users/police-stations/:keyword', verify_token, authorization([admin]), user.getPoliceStations);
// router.post('/users', verify_token, authorization([admin]), Validator(UserValidators.create), user.create);
router.post('/users', Validator(UserValidators.create), user.create);
router.put('/users/:id', verify_token, authorization([admin]), Validator(UserValidators.update), user.update);
router.put('/users/:id/image/update', verify_token, authorization([admin, user]), photo.upload, user.updateImage);
router.delete('/users/:id/image/delete', verify_token, authorization([admin, user]), user.deleteImage);
router.put('/users/:id/deactivate', verify_token, authorization([admin]), user.deactivate);
router.put('/users/:id/activate', verify_token, authorization([admin]), user.activate);

module.exports = router;