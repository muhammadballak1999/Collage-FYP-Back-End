const Role = require("../models/role");
const AppError = require('../utils/appError');
const catchAsync  = require('../utils/catchAsync')

// Get Roles

exports.get = catchAsync(async(req, res, next) => {

    let role = await Role.find({isDeleted: false})
    .select('-createdAt -createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted');

    res.status(200).send({
        success: true,
        message: 'All Roles fetched successfully',
        data: role
    });
});


// Get One Role

exports.getOne = catchAsync(async(req, res, next) => {

    let role = await Role.findOne({_id: req.params.id, isDeleted: false});
    if(role) {
        res.status(200).send({
            success: true,
            message: 'Role fetched successfully',
            data: role
        })
        return
    }

        next(new AppError('No Role was found!', 404));
        return
});


// Create Role

exports.create = catchAsync(async(req, res, next) => {

    var role = new Role();
    role.role = req.body.role;
    role.createdBy = req.decoded.id;

    await role.save();

    res.status(200).send({
        success: true,
        message: 'Role created successfully',
        data: role
    })

});


// Update Role

exports.update = catchAsync(async(req, res, next) => {

    let role = await Role.findOne({_id: req.params.id, isDeleted: false});

    if(!role) { 
        next(new AppError('No Role was found!', 404));
        return
    }

    if(req.body.role){role.role = req.body.role}
    role.updatedBy = req.decoded.id;
    role.updatedAt = new Date(Date.now());

    await role.save();

    res.status(200).send({
        success: true,
        message: 'Role updated successfully',
        data: role
    })
});


// Delete Role

exports.delete = catchAsync(async(req, res, next) => {

    let role = await Role.findOne({_id: req.params.id, isDeleted: false});

    if(!role) { 
        next(new AppError('No Role was found!', 404));
        return
    }

    role.isDeleted = true;
    role.deletedBy = req.decoded.id;
    role.deletedAt = new Date(Date.now());

    await role.save();

    res.status(200).send({
        success: true,
        message: 'Role deleted successfully',
        data: case_status
    })
});