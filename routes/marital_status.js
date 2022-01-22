const router = require('express').Router();
const marital_status = require('../controllers/blog');
const { authorization } = require('../middlewares/authorization');
const verify_token = require('../middlewares/verify-token');
const { MaritalStatusValidators } =  require("../middlewares/Validator/index");
const Validator = require("../middlewares/Validator/validator");

router.get('/marital-status',  marital_status.get);
// router.get('/marital-status/:id', verify_token, authorization(['admin']), marital_status.getOne);
router.post('/marital-status', verify_token, authorization(['admin']), Validator(MaritalStatusValidators.create), marital_status.create);
router.put('/marital-status/:id', verify_token, authorization(['admin']), Validator(MaritalStatusValidators.update), marital_status.update);
router.delete('/marital-status/:id', verify_token, authorization(['admin']), marital_status.delete);


module.exports = router;