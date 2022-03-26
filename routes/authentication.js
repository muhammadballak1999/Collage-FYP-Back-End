const router = require('express').Router();
const auth = require('../controllers/authentication');
const {authValidators} =  require("../middlewares/validator/index");
const Validator = require("../middlewares/validator/validator");

router.post('/login', Validator(authValidators.login), auth.login);
router.get('/otp/:phone', auth.otp);
router.post('/otp-sign-up', Validator(authValidators.otpSignUp), auth.otpSignup);
router.get('/verify-otp/:phone/:otp', auth.verify_otp);
router.post('/signup',  Validator(authValidators.signup), auth.signup);

module.exports = router;