const router = require('express').Router();
const about = require('../controllers/about');
const { authorization } = require('../middlewares/authorization');
const verify_token = require('../middlewares/verify-token');
const { admin, user, police} = require('../utils/roles');
const { AboutValidators } =  require("../middlewares/validator/index");
const Validator = require("../middlewares/validator/validator");

router.get('/about', verify_token, authorization([admin, user, police]), about.get);
// router.get('/terms-and-conditions/:id', verify_token, authorization([admin, user, police]), about.getOne);
router.post('/about', verify_token, authorization([admin]), Validator(AboutValidators.create), about.create);
router.put('/about/:id', verify_token, authorization([admin]), Validator(AboutValidators.update), about.update);
// router.delete('/terms-and-conditions/:id', verify_token, authorization([admin]), about.delete);


module.exports = router;