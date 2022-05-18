const User = require("../models/user");
const Role = require("../models/role");
const PoliceStation = require("../models/police_station");
const catchAsync  = require('../utils/catchAsync');
const bcrypt = require('bcrypt');
const {send_message} = require('../utils/twilio');
const { uploadToCloud } = require("../utils/cloudUpload");

exports.get = catchAsync(async(req, res, next) => {

    let admin = await Role.findOne({role: 'admin'}).select('id');
    let user = await Role.findOne({role: 'user'}).select('id');
    let police = await Role.findOne({role: 'police'}).select('id');

    let admins = await User.find({type: admin.id}).populate('type', 'role').select('-password -createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted').limit(100).sort({_id: -1})
    let users = await User.find({type: user.id}).populate('type', 'role').select('-password -createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted').limit(100).sort({_id: -1})
    let police_stations = await User.find({type: police.id}).populate('type', 'role').populate('police_station').select('-password -createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted').limit(100).sort({_id: -1})


    res.status(200).send({
        success: true,
        message: 'All Users fetched successfully',
        data: {
            admins,
            users,
            police_stations
        }
    })
});

exports.getOne = catchAsync(async(req, res, next) => {

    let user = await User.findOne({_id: req.params.id})
    .select('-password -createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted')

    if(!user) {
        res.status(404).send({
            success: true,
            message: 'No user was found!',
            data: {}
        })
        return        
    }

    res.status(200).send({
        success: true,
        message: 'User fetched successfully',
        data: user
    })
});

exports.getMe = catchAsync(async(req, res, next) => {

    let user = await User.findOne({_id: req.decoded.id})
    .select('-password -createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted')
    .populate('marital_status', 'status')
    .populate('attachment', 'url')

    if(!user) {
        res.status(404).send({
            success: true,
            message: 'No user was found!',
            data: {}
        })
        return        
    }

    res.status(200).send({
        success: true,
        message: 'User fetched successfully',
        data: user
    })

});

exports.updateMe = catchAsync(async(req, res, next) => {
    let user = await User.findOne({_id: req.decoded.id, isSuspended: false, isDeleted: false})
    .select('-password -createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted')

    if(!user) {
        res.status(404).send({
            success: true,
            message: 'No user was found!',
            data: {}
        })
        return        
    }

    if(req.body.name && req.body.name !== user.name) user.name = req.body.name;
    if(req.body.city && req.body.city !== user.city) user.city = req.body.city;
    if(req.body.marital_status && req.body.name !== user.marital_status) user.marital_status = req.body.marital_status;

    await user.save();
    
    res.status(200).send({
        success: true,
        message: 'User updated successfully',
        data: user
    })
});

exports.create = catchAsync(async(req, res, next) => {

    let userByEmail = await User.findOne({'email': req.body.email});
    let userByPhone = await User.findOne({'phone': req.body.phone});

    if(userByEmail){
            res.status(403).send({
                success: false,
                error: true,
                message: 'duplicateEmail',
                data: {}
                })
                return
    }
    if(userByPhone){
                res.status(403).send({
                    success: false,
                    error: true,
                    message: 'duplicatePhone',
                    data: {}
                })
                return
    }

    let user = new User();
    let type = await Role.findOne({_id: req.body.type});

    user.name = req.body.name;
    user.email = req.body.email;
    user.phone = req.body.phone;
    user.location = req.body.location;
    user.city = req.body.city;
    user.type = req.body.type;
    user.marital_status = type.role === 'user' ? req.body.marital_status : null;
    user.case = null;

    if(type.role === 'police') {
        let ps = new PoliceStation();
        ps.latitude = req.body.latitude;
        ps.longitude = req.body.longitude;
        await ps.save();
        user.police_station = ps._id;
    }

    await bcrypt.hash(req.body.password, Number(process.env.saltRounds), async function(err, hash) {
        user.password = hash;
        await User.create(user);
        res.status(200).send({
            success: true,
            message: 'User created successfully',
            data: user
        })
    });
});

exports.update = catchAsync(async(req, res, next) => {

    let user = await User.findOne({_id: req.params.id})

    let userByEmail = await User.findOne({'email': req.body.email});
    let userByPhone = await User.findOne({'phone': req.body.phone});

    if(userByEmail){
    if(user.id !== userByEmail.id) {
            res.status(403).send({
                success: false,
                message: 'duplicateEmail',
                error: true,
                data: {}
                })
                return
        }
    }
    if(userByPhone){
        if(user.id !== userByPhone.id) {
                res.status(403).send({
                    success: false,
                    message: 'duplicatePhone',
                    error: true,
                    data: {}
                })
                return
        }
    }

    if(req.body.name && req.body.name !== user.name) {user.name = req.body.name};
    if(req.body.email && req.body.email !== user.email) {user.email = req.body.email};
    if(req.body.phone && req.body.phone !== user.phone) {user.phone = req.body.phone};
    if(req.body.location && req.body.location !== user.location) {user.location = req.body.location};
    if(req.body.city && req.body.city !== user.city) {user.city = req.body.city};
    if(req.body.latitude && req.body.latitude !== user.latitude) {user.latitude = req.body.latitude};
    if(req.body.longitude && req.body.longitude !== user.longitude) {user.longitude = req.body.longitude};
    if(req.body.marital_status && req.body.marital_status !== user.marital_status) {user.marital_status = req.body.marital_status};

    if(user.police_station){
        let ps = await PoliceStation.findOne({_id: user.police_station});
        if(req.body.latitude && req.body.latitude !== ps.latitude) ps.latitude = req.body.latitude;
        if(req.body.longitude && req.body.longitude !== ps.longitude) ps.longitude = req.body.longitude;
        await ps.save();
  }

    if(req.body.password) {
    await bcrypt.hash(req.body.password, Number(process.env.saltRounds), async function(err, hash) {
        let equal = await bcrypt.compare(req.body.password, user.password);
        if(!equal) {
            user.password = hash;
          }
        await user.save();
        res.status(200).send({
            success: true,
            message: 'User updated successfully',
            data: user
        })
    });
  }else {
    await user.save();
    res.status(200).send({
        success: true,
        message: 'User updated successfully',
        data: user
    })
  }
});

exports.updateImage = catchAsync(async(req, res, next) => {
    if(req.file) {
        let user = await User.findOne({_id: req.decoded.id});
        var attachment = await uploadToCloud(req);
        user.attachment = attachment.id;
        await user.save();

        res.status(200).send({
            success: true,
            message: 'Image updated successfully',
            data: {
                url: attachment.url
            }
        })
    } else {

        res.status(401).send({
            success: true,
            message: 'No file was found!',
            data: {}
        })
    }
});

exports.deleteImage = catchAsync(async(req, res, next) => {
        let user = await User.findOne({_id: req.decoded.id});
        user.attachment = null;
        await user.save();

        res.status(200).send({
            success: true,
            message: 'Image removed successfully',
            data: {}
        })
});

exports.deactivate = catchAsync(async(req, res, next) => {

    let user = await User.findOne({_id: req.params.id}) 
    if(user.id === req.decoded.id) {
        res.status(401).send({
            success: false,
            message: 'You can not deactivate your account!',
            data:{}
        })
        return
    }
    user.isSuspended = true;
    user.suspendedBy = req.decoded.id;
    user.suspendedAt = new Date(Date.now());
    user.case = null;
    await user.save();


    res.status(200).send({
        success: true,
        message: 'User suspended successfully',
        data: user
    })
   send_message(`Hi ${user.name ? user.name : 'there'}, your parez account has been deactivated for some reasons please contact adminstration (+964xxxxxxx) for activation.`, user.phone);

});

exports.activate = catchAsync(async(req, res, next) => {

    let user = await User.findOne({_id: req.params.id}) 
    user.isSuspended = false;
    user.suspendedBy = req.decoded.id;
    user.suspendedAt = new Date(Date.now());
    user.case = null;
    await user.save();


    res.status(200).send({
        success: true,
        message: 'User activated successfully',
        data: user
    })
   send_message(`Hi ${user.name ? user.name : 'there'}, your parez account has been activated`, user.phone);

});

exports.getUsers = catchAsync(async(req, res, next) => {

    let userRole = await Role.findOne({role: 'user'}).select('id');
    if(req.params.keyword==='undefined'){req.params.keyword = ''}
    var regex = new RegExp(req.params.keyword);

    let users = await User.find({type: userRole.id}).populate('marital_status', 'status')
    .or([{ 'name': {$regex: regex}}])
    .populate('type', 'role')
    .select('-password -createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted')
    .limit(100).sort({_id: -1});

    res.status(200).send({
        success: true,
        message: 'Users fetched successfully',
        data: users
    })
});

exports.getAdmins = catchAsync(async(req, res, next) => {

    let adminRole = await Role.findOne({role: 'admin'}).select('id');
    if(req.params.keyword==='undefined'){req.params.keyword = ''}
    var regex = new RegExp(req.params.keyword);
    
    let admins = await User.find({type: adminRole.id }).populate('marital_status', 'status')
    .or([
        // { 'username': {$regex: regex}},
         { 'name': {$regex: regex}}])
    .populate('type', 'role').select('-password -createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted')
    .limit(100).sort({_id: -1});

    res.status(200).send({
        success: true,
        message: 'Admins fetched successfully',
        data: admins
    })
});

exports.getPoliceStations = catchAsync(async(req, res, next) => {

    let policeRole = await Role.findOne({role: 'police'}).select('id');
    if(req.params.keyword==='undefined'){req.params.keyword = ''}
    var regex = new RegExp(req.params.keyword);

    let police_stations = await User.find({type: policeRole.id}).populate('marital_status', 'status').populate('police_station', 'latitude longitude')
    .or([
        // { 'username': {$regex: regex}}, 
        { 'name': {$regex: regex}}])
    .populate('type', 'role')
    .select('-password -createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted')
    .limit(100).sort({_id: -1});

    res.status(200).send({
        success: true,
        message: 'Police stations fetched successfully',
        data: police_stations
    })
});