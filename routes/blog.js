const router = require('express').Router();
const blog = require('../controllers/blog');
const { authorization } = require('../middlewares/authorization');
const verify_token = require('../middlewares/verify-token')


router.get('/blogs', verify_token, authorization(['admin','user']), blog.getAllBlogs);
// router.post('/blogs', photo.upload, blog.getAllBlogs);


module.exports = router;