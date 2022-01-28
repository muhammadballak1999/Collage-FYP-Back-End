const Attachment = require('../models/attachment');
const cloudinary = require('./cloudinary');
const catchAsync  = require('../utils/catchAsync');

exports.uploadToCloud = async (req) => {
    var attachment = new Attachment();
    await cloudinary.uploader.upload(req.file.path, async function(result){ 
    attachment.url = result.url;
    attachment.createdBy = req.decoded.id;
    await attachment.save();
    });
    return attachment;
};