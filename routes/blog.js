const router = require('express').Router();
const blog = require('../controllers/blog');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const photo = require('../middlewares/multer');
const cloudinary = require('cloudinary');


router.get('/blogs', blog.getAllBlogs);
// router.post('/blogs', photo.upload, blog.getAllBlogs);


module.exports = router;