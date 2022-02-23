const Notification = require("../models/notification");
const User = require("../models/user");
const AppError = require('../utils/appError');
const catchAsync  = require('../utils/catchAsync')

exports.get = catchAsync(async(req, res, next) => {

});

exports.getOne = catchAsync(async(req, res, next) => {

});

exports.create = catchAsync(async(req, res, next) => {

});

exports.update = catchAsync(async(req, res, next) => {

});

exports.update_fcm_token_mobile = catchAsync(async(req, res, next) => {

    let user = await User.findOne({_id: req.decoded.id});
    if(req.params.token && user.fcm_token_mobile !== req.params.token){user.fcm_token_mobile = req.params.token}

    await user.save();

    res.status(200).send({
        success: true,
        message: 'FCM token updated successfully',
        data: {
            fcm_token: user.fcm_token_mobile
        }
    });

});

exports.update_fcm_token_web = catchAsync(async(req, res, next) => {

    let user = await User.findOne({_id: req.decoded.id});
    if(req.params.token && user.fcm_token_web !== req.params.token){user.fcm_token_web = req.params.token}

    await user.save();

    res.status(200).send({
        success: true,
        message: 'FCM token updated successfully',
        data: {
            fcm_token: user.fcm_token_web
        }
    });

});

exports.delete = catchAsync(async(req, res, next) => {

});