const router = require('express').Router();
const auth = require('../controllers/authentication');
const { authorization } = require('../middlewares/authorization');
const {authValidators} =  require("../middlewares/Validator/index");
const Validator = require("../middlewares/Validator/validator");
const verifyToken = require('../middlewares/verify-token');
const { user } = require('../utils/roles');

router.post('/login', Validator(authValidators.login), auth.login);
router.get('/otp/:phone', auth.otp);
router.get('/verify-otp/:phone/:otp', auth.verify_otp);
router.post('/signup',  Validator(authValidators.signup), auth.signup);

module.exports = router;