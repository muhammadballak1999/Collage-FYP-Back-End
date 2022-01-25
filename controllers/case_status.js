const CaseStatus = require("../models/case_status");
const AppError = require('../utils/appError');
const catchAsync  = require('../utils/catchAsync')

// Get Case Status

exports.get = catchAsync(async(req, res, next) => {

    let case_status = await CaseStatus.find({isDeleted: false});

    res.status(200).send({
        success: true,
        message: 'All Case Status fetched successfully',
        data: case_status
    });
});


// Get One Case Status

exports.getOne = catchAsync(async(req, res, next) => {

    let case_status = await CaseStatus.findOne({_id: req.params.id, isDeleted: false});
    if(case_status) {
        res.status(200).send({
            success: true,
            message: 'Case Status fetched successfully',
            data: case_status
        })
        return
    }

        next(new AppError('No Case Status was found!', 404));
        return
});


// Create Case Status

exports.create = catchAsync(async(req, res, next) => {

    var case_status = new CaseStatus();
    case_status.status = req.body.status;
    case_status.createdBy = req.decoded.id;

    await case_status.save();

    res.status(200).send({
        success: true,
        message: 'Case Status created successfully',
        data: case_status
    })

});


// Update Case Status

exports.update = catchAsync(async(req, res, next) => {

    let case_status = await CaseStatus.findOne({_id: req.params.id, isDeleted: false});

    if(!case_status) { 
        next(new AppError('No Case Status was found!', 404));
        return
    }

    if(req.body.status){case_status.status = req.body.status}
    case_status.updatedBy = req.decoded.id;
    case_status.updatedAt = new Date(Date.now());

    await case_status.save();

    res.status(200).send({
        success: true,
        message: 'Case Status updated successfully',
        data: case_status
    })
});


// Delete Case Status

exports.delete = catchAsync(async(req, res, next) => {

    let case_status = await CaseStatus.findOne({_id: req.params.id, isDeleted: false});

    if(!case_status) { 
        next(new AppError('No Case Status was found!', 404));
        return
    }

    case_status.isDeleted = true;
    case_status.deletedBy = req.decoded.id;
    case_status.deletedAt = new Date(Date.now());

    await case_status.save();


    res.status(200).send({
        success: true,
        message: 'Case Status deleted successfully',
        data: case_status
    })
});