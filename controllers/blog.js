const Blog = require("../models/blog");
const AppError = require('../utils/appError');
const cloudinary = require('../utils/imageUpload');
const catchAsync  = require('../utils/catchAsync')

exports.getAllBlogs = catchAsync(async(req, res, next) => {
    res.status(200).send({
        success: true
    })
});