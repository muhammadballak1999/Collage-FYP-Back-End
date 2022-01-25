const router = require('express').Router();
const notification = require('../controllers/notification');
const { authorization } = require('../middlewares/authorization');
const verify_token = require('../middlewares/verify-token');
const { admin, user } = require('../utils/roles');
const { NotificationValidators } =  require("../middlewares/Validator/index");
const Validator = require("../middlewares/Validator/validator");

router.get('/notifications', verify_token, authorization([admin, user]), notification.get);
router.get('/notifications/:id', verify_token, authorization([admin, user]), notification.getOne);
router.post('/notifications', verify_token, authorization([admin]), Validator(NotificationValidators.create), notification.create);
router.put('/notifications/:id', verify_token, authorization([admin]), Validator(NotificationValidators.update), notification.update);
router.delete('/notifications/:id', verify_token, authorization([admin]), notification.delete);

module.exports = router;