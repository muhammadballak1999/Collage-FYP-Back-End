const router = require('express').Router();
const blog = require('../controllers/blog');


router.get('/blogs', blog.getAllBlogs);
// router.post('/blogs', photo.upload, blog.getAllBlogs);


module.exports = router;