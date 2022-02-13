const router = require('express').Router();
const violence_cases = require('../controllers/violence_case');
const { authorization } = require('../middlewares/authorization');
const verify_token = require('../middlewares/verify-token');
const { admin, police, user } = require('../utils/roles');
const { ViolenceCasesValidators } =  require("../middlewares/Validator/index");
const Validator = require("../middlewares/Validator/validator");

router.get('/violence-cases', verify_token, authorization([admin, police]), violence_cases.get);
router.get('/violence-cases/:id', verify_token, authorization([admin, police]), violence_cases.getOne);
router.post('/violence-cases', verify_token, authorization([admin, police, user,]), Validator(ViolenceCasesValidators.create), violence_cases.create);
router.put('/violence-cases/:id', verify_token, authorization([admin, police, user]), Validator(ViolenceCasesValidators.update), violence_cases.update);
router.delete('/violence-cases/:id', verify_token, authorization([admin, police]), violence_cases.delete);

module.exports = router;