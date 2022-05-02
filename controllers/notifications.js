const Notification = require("../models/notification");
const User = require("../models/user");
const AppError = require('../utils/appError');
const catchAsync  = require('../utils/catchAsync')

exports.get = catchAsync(async(req, res, next) => {


    let notifications = [];

    if(req.decoded.type === 'admin'){

     notifications = await Notification.find({isDeleted: false})
    .select('-createdAt -createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted -user_id');

    } else {

        notifications = await Notification.find({user_id: req.decoded.id ,isDeleted: false})
        .select('-createdAt -createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted -user_id');
    }

    for(let i = 0; i < notifications.length; i++) {
        notifications[i] = {
             id: notifications[i].id,
             title: notifications[i].title,
             content: notifications[i].content,
             send: false}
       }

    res.status(200).send({
        success: true,
        message: "All notifications fetched successfully",
        data: notifications
    })
});

exports.getOne = catchAsync(async(req, res, next) => {

    let notification = {};

    if(req.decoded.type === 'admin'){

     notification = await Notification.findOne({isDeleted: false})
    .select('-createdAt -createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted -user_id');

    } else {

        notification = await Notification.find({_id: req.params.id, user_id: req.decoded.id ,isDeleted: false})
        .select('-createdAt -createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted -user_id');
    }

    if(!notification) {
        
        res.status(404).send( {
            success: false,
            error: true,
            message: "No notification was found",
            data: {}
        })
    } else {
        res.status(200).send({
            success: true,
            message: "Notification fetched successfully",
            data: notification
        }) 
    }

});

exports.create = catchAsync(async(req, res, next) => {

    let notification = new Notification();

    notification.title = req.body.title;
    notification.content = req.body.content;

    await notification.save();

    res.status(200).send({
        success: true,
        message: "Notification created successfully",
        data: notification
    }) 

});

exports.update = catchAsync(async(req, res, next) => {

    let notification = await Notification.findOne({_id: req.params.id, isDeleted: false})
    .select('-createdAt -createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted -user_id');

    if(!notification) {
   
        res.status(404).send( {
            success: false,
            error: true,
            message: "No notification was found!",
            data: {}
        })
        return
    }

    if(notification.title && notification.title !== req.body.title) notification.title = req.body.title;
    if(notification.content && notification.content !== req.body.content) notification.content = req.body.content;

    await notification.save();

    res.status(200).send({
        success: true,
        message: "Notification updated successfully",
        data: notification
    }) 

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
    let notification = await Notification.findOne({_id: req.params.id, isDeleted: false})

    if(!notification) {
   
        res.status(404).send( {
            success: false,
            error: true,
            message: "No notification was found!",
            data: {}
        })
        return
    }

    notification.isDeleted = true;
    notification.deletedBy = req.decoded.id

    await notification.save();

    res.status(200).send({
        success: true,
        message: "Notification deleted successfully",
        data: notification
    }) 
});

exports.send = catchAsync(async(req, res, next) => {

    let notification = await Notification.find({_id: req.params.id, isDeleted: false})
    .select('-createdAt -createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted -user_id');

    res.status(200).send({
        success: true,
        message: 'Notification send successfully',
        data: notification
    });

});