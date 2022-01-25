const router = require('express').Router();
const role = require('../controllers/role');
const { authorization } = require('../middlewares/authorization');
const verify_token = require('../middlewares/verify-token');
const { admin } = require('../utils/roles');
const { RoleValidators } =  require("../middlewares/Validator/index");
const Validator = require("../middlewares/Validator/validator");

router.get('/roles', verify_token, authorization([admin]), role.get);
router.get('/roles/:id', verify_token, authorization([admin]), role.getOne);
router.post('/roles', Validator(RoleValidators.create), role.create);
router.put('/roles/:id', verify_token, authorization([admin]), Validator(RoleValidators.update), role.update);
router.delete('/roles/:id', verify_token, authorization([admin]), role.delete);

module.exports = router;