const MartitalStatus = require("../models/marital_status");
const AppError = require('../utils/appError');
const catchAsync  = require('../utils/catchAsync')

// Get Marital Status

exports.get = catchAsync(async(req, res, next) => {

    let marital_status = await MartitalStatus.find({isDeleted: false})
    .select('-createdAt -createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted');;

    res.status(200).send({
        success: true,
        message: 'All Marital Status fetched successfully',
        data: marital_status
    });
});


// Get One Marital Status

exports.getOne = catchAsync(async(req, res, next) => {

    let marital_status = await MartitalStatus.findOne({_id: req.params.id, isDeleted: false});
    if(marital_status) {
        res.status(200).send({
            success: true,
            message: 'Marital Status fetched successfully',
            data: marital_status
        })
        return
        }
        next(new AppError('No Marital Status was found!', 404));
        return
});


// Create Marital Status

exports.create = catchAsync(async(req, res, next) => {

    var marital_status = new MartitalStatus();
    marital_status.status = req.body.status;
    marital_status.createdBy = req.decoded.id;

    await marital_status.save();

    res.status(200).send({
        success: true,
        message: 'Marital Status created successfully',
        data: marital_status
    })

});


// Update Marital Status

exports.update = catchAsync(async(req, res, next) => {

    let marital_status = await MartitalStatus.findOne({_id: req.params.id, isDeleted: false});

    if(!marital_status) { 
        next(new AppError('No Marital Status was found!', 404));
        return 
    }

    if(req.body.status){marital_status.status = req.body.status}
    marital_status.updatedBy = req.decoded.id;
    marital_status.updatedAt = new Date(Date.now());

    await marital_status.save();

    res.status(200).send({
        success: true,
        message: 'Marital Status updated successfully',
        data: marital_status
    })
});


// Delete Marital Status

exports.delete = catchAsync(async(req, res, next) => {

    let marital_status = await MartitalStatus.findOne({_id: req.params.id, isDeleted: false});

    if(!marital_status) { 
        next(new AppError('No Marital Status was found!', 404));
        return
    }

    marital_status.isDeleted = true;
    marital_status.deletedBy = req.decoded.id;
    marital_status.deletedAt = new Date(Date.now());

    await marital_status.save();


    res.status(200).send({
        success: true,
        message: 'Marital Status deleted successfully',
        data: marital_status
    })
});