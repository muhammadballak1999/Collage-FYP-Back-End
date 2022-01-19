const router = require('express').Router();
const auth = require('../controllers/authentication');
const {authValidators} =  require("../middlewares/Validator/index");
const Validator = require("../middlewares/Validator/validator");

router.post('/login', Validator(authValidators.login), auth.login);
router.post('/signup', Validator(authValidators.signup), auth.signup);

module.exports = router;