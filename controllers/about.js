const About = require("../models/about");
const catchAsync  = require('../utils/catchAsync');

// Get About

exports.get = catchAsync(async(req, res, next) => {

    let about = await About.find({isDeleted: false})
    .select('-createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted')
    .sort({_id: -1})
    .exec();

    if(about.length === 0) {
        let about = new About();
        about.content = '';
        await about.save();
        res.status(200).send({
            success: true,
            message: 'New about created successfully',
            data: about
        })
        return
    }

    res.status(200).send({
        success: true,
        message: 'About fetched successfully',
        data: about[0]
    });
});


// Create About

exports.create = catchAsync(async(req, res, next) => {

    var about = new About();

    about.content = req.body.content; 
    about.createdBy = req.decoded.id;

    await about.save();

    res.status(200).send({
        success: true,
        message: 'About created successfully',
        data: about
    })

});


// Update About

exports.update = catchAsync(async(req, res, next) => {

    let about = await About.findOne({_id: req.params.id, isDeleted: false});

    if(!about) {
        res.status(404).send({
            success: false,
            message: 'No about was found!',
            data: {}
        })
    }

    if(req.body.content){about.content = req.body.content}
    if(req.body.content === '') {about.content = '<p></p>'}
    about.updatedBy = req.decoded.id;
    about.updatedAt = new Date(Date.now());

    await about.save();

    res.status(200).send({
        success: true,
        message: 'About updated successfully',
        data: about
    })
});
