const router = require('express').Router();
const blog = require('../controllers/blog');
const { authorization } = require('../middlewares/authorization');
const verify_token = require('../middlewares/verify-token');
const photo = require('../middlewares/multer');
const { BlogValidators } =  require("../middlewares/Validator/index");
const Validator = require("../middlewares/Validator/validator");

router.get('/blogs', verify_token, authorization(['admin','user']), blog.get);
router.get('/blogs/:id', verify_token, authorization(['admin','user']), blog.getOne);
router.post('/blogs', verify_token, authorization(['admin']), Validator(BlogValidators.create), photo.upload, blog.create);
router.put('/blogs/:id', verify_token, authorization(['admin']), Validator(BlogValidators.update),photo.upload, blog.update);
router.delete('/blogs/:id', verify_token, authorization(['admin']), blog.delete);

module.exports = router;