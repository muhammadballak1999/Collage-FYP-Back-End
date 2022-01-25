const router = require('express').Router();
const blog = require('../controllers/blog');
const { authorization } = require('../middlewares/authorization');
const verify_token = require('../middlewares/verify-token');
const { admin, police } = require('../utils/roles');
const photo = require('../middlewares/multer');
const { BlogValidators } =  require("../middlewares/Validator/index");
const Validator = require("../middlewares/Validator/validator");

router.get('/violence-cases', verify_token, authorization([admin, police]), blog.get);
router.get('/violence-cases/:id', verify_token, authorization([admin, police]), blog.getOne);
router.post('/violence-cases', verify_token, authorization([user]), Validator(BlogValidators.create), photo.upload, blog.create);
router.put('/violence-cases/:id', verify_token, authorization([admin, police]), Validator(BlogValidators.update),photo.upload, blog.update);
router.delete('/violence-cases/:id', verify_token, authorization([admin, police]), blog.delete);

module.exports = router;