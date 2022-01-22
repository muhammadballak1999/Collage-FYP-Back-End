const router = require('express').Router();
const admin = require('../controllers/admin');
const { authorization } = require('../middlewares/authorization');
const Validator = require("../middlewares/Validator/validator");
const { policeStationValidators } = require('../middlewares/Validator');
const verify_token = require('../middlewares/verify-token')

// verify_token, authorization(['admin']), Validator(policeStationValidators.create),

module.exports = router;