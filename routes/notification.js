const router = require('express').Router();
const notification = require('../controllers/notifications');
const { authorization } = require('../middlewares/authorization');
const verify_token = require('../middlewares/verify-token');
const { admin, police, user } = require('../utils/roles');
const { NotificationValidators } =  require("../middlewares/validator/index");
const Validator = require("../middlewares/validator/validator");

router.get('/notifications', verify_token, authorization([admin, user]), notification.get);
router.get('/notifications/:id', verify_token, authorization([admin, user]), notification.getOne);
router.post('/notifications/send/notification', verify_token, authorization([admin]), notification.send);
router.post('/notifications', verify_token, authorization([admin]), Validator(NotificationValidators.create), notification.create);
router.put('/notifications/:id', verify_token, authorization([admin]), Validator(NotificationValidators.update), notification.update);
router.put('/fcm-token-mobile/:token', verify_token, authorization([admin, police, user]), notification.update_fcm_token_mobile);
router.put('/fcm-token-web/:token', verify_token, authorization([admin, police, user]), notification.update_fcm_token_web);
router.delete('/notifications/:id', verify_token, authorization([admin]), notification.delete);

module.exports = router;