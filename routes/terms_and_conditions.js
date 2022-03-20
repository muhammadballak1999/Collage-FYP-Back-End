const router = require('express').Router();
const terms_and_conditions = require('../controllers/terms_and_conditions');
const { authorization } = require('../middlewares/authorization');
const verify_token = require('../middlewares/verify-token');
const { admin, user, police} = require('../utils/roles');
const { TermsAndConditionsValidators } =  require("../middlewares/validator/index");
const Validator = require("../middlewares/validator/validator");

router.get('/terms-and-conditions', verify_token, authorization([admin, user, police]), terms_and_conditions.get);
// router.get('/terms-and-conditions/:id', verify_token, authorization([admin, user]), terms_and_conditions.getOne);
router.post('/terms-and-conditions', verify_token, authorization([admin]), Validator(TermsAndConditionsValidators.create), terms_and_conditions.create);
router.put('/terms-and-conditions/:id', verify_token, authorization([admin]), Validator(TermsAndConditionsValidators.update), terms_and_conditions.update);
// router.delete('/terms-and-conditions/:id', verify_token, authorization([admin]), terms_and_conditions.delete);


module.exports = router;