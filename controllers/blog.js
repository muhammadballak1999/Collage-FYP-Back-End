const Blog = require("../models/blog");
const Attachment = require("../models/attachment");
const catchAsync  = require('../utils/catchAsync');
const { uploadToCloud } = require("../utils/cloudUpload");

//Get Blogs

exports.get = catchAsync(async(req, res, next) => {

    let blogs = await Blog.find({isDeleted: false})
    .populate('attachment', 'url')
    .select('-createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted')
    .sort({_id: -1})
    .exec();

    res.status(200).send({
        success: true,
        message: 'All blogs fetched successfully',
        data: blogs
    });
});


//Get One Blog

exports.getOne = catchAsync(async(req, res, next) => {

    let blog = await Blog.findOne({_id: req.params.id, isDeleted: false}).populate('attachment', 'url').exec();
    if(blog) {
        res.status(200).send({
            success: true,
            message: 'Blog fetched successfully',
            data: blog
        })
        return
        }
        res.status(404).send({
            success: false,
            message: 'No blog was found!',
            data: {}
        })
});


// Create Blog

exports.create = catchAsync(async(req, res, next) => {

    var blog = new Blog();
    blog.title = req.body.title;
    blog.content = req.body.content; 
    blog.createdBy = req.decoded.id;

    if(req.file) {
    var attachment = await uploadToCloud(req);
    blog.attachment = attachment.id;
   }

    await blog.save();

    res.status(200).send({
        success: true,
        message: 'Blog created successfully',
        data: blog
    })

});


// Update Blog

exports.update = catchAsync(async(req, res, next) => {

    let blog = await Blog.findOne({_id: req.params.id, isDeleted: false});

    if(!blog) { 
        res.status(404).send({
            success: false,
            message: 'No blog was found!',
            data: {}
        })  
    }

    if(req.body.title && req.body.title !== blog.title){blog.title = req.body.title}
    if(req.body.content && req.body.content !== blog.content){blog.content = req.body.content}
    blog.updatedBy = req.decoded.id;
    blog.updatedAt = new Date(Date.now());

    if(req.file) {
        var attachment = await uploadToCloud(req);
        blog.attachment = attachment.id;
    }

    await blog.save();

    res.status(200).send({
        success: true,
        message: 'Blog updated successfully',
        data: blog
    })
});


// Delete Blog

exports.delete = catchAsync(async(req, res, next) => {

    let blog = await Blog.findOne({_id: req.params.id, isDeleted: false});

    if(!blog) { 
        res.status(404).send({
            success: false,
            message: 'No blog was found!',
            data: {}
        })  
        return
    }

    blog.isDeleted = true;
    blog.deletedBy = req.decoded.id;
    blog.deletedAt = new Date(Date.now());

    await blog.save();


    res.status(200).send({
        success: true,
        message: 'Blog deleted successfully',
        data: blog
    })
});

// Delete Blog image

exports.deleteBlogImage = catchAsync(async(req, res, next) => {

    let blog = await Blog.findOne({_id: req.params.id, isDeleted: false});
    if(!blog) { 
        res.status(404).send({
            success: false,
            message: 'No blog was found!',
            data: {}
        })  
        return
    }

    if(!blog.attachment) { 
        res.status(404).send({
            success: false,
            message: 'Blog does not include image!',
            data: {}
        })  
        return
    }
    
    let attachment = await Attachment.findOne({_id: blog.attachment});

    blog.attachment = null;
    attachment.url = null;
    attachment.isDeleted = true;
    attachment.deletedBy = req.decoded.id;

    await blog.save();
    await attachment.save();

    res.status(200).send({
        success: true,
        message: 'Image deleted successfully',
        data: blog
    })
});