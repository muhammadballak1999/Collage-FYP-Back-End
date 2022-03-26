const User = require("../models/user");
const Role = require("../models/role");
const PoliceStation = require("../models/police_station");
const AppError = require('../utils/appError');
const cloudinary = require('../utils/cloudinary');
const catchAsync  = require('../utils/catchAsync');
const bcrypt = require('bcrypt');

exports.get = catchAsync(async(req, res, next) => {

    let admin = await Role.findOne({role: 'admin'}).select('id');
    let user = await Role.findOne({role: 'user'}).select('id');
    let police = await Role.findOne({role: 'police'}).select('id');

    let admins = await User.find({type: admin.id}).populate('type', 'role').select('-password -createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted').limit(100);
    let users = await User.find({type: user.id}).populate('type', 'role').select('-password -createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted').limit(100);
    let police_stations = await User.find({type: police.id}).populate('type', 'role').populate('police_station').select('-password -createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted').limit(100);


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

exports.create = catchAsync(async(req, res, next) => {

    let current = await User.findOne({email: req.body.email});

    if(current) {
        res.status(403).send({
            success: false,
            message: 'User already exists!',
            data: {}
        })
        return
    }

    let user = new User();

    user.name = req.body.name;
    user.username = req.body.username;
    user.email = req.body.email;
    user.phone = req.body.phone;
    user.location = req.body.location;
    user.city = req.body.city;
    user.type = req.body.type;
    user.marital_status = req.body.marital_status;

    let type = await Role.findOne({_id: req.body.type});
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

    if(req.body.name && req.body.name !== user.name) {user.name = req.body.name};
    if(req.body.username && req.body.username !== user.username) {user.username = req.body.username};
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


exports.delete = catchAsync(async(req, res, next) => {

    let user = await User.findOne({_id: req.params.id}) 
    user.isSuspended = true;
    user.suspendedBy = req.decoded.id;
    user.suspendedAt = new Date(Date.now());
    await user.save();


    res.status(200).send({
        success: true,
        message: 'User suspended successfully',
        data: user
    })
});

exports.getUsers = catchAsync(async(req, res, next) => {

    let userRole = await Role.findOne({role: 'user'}).select('id');
    if(req.params.keyword==='undefined'){req.params.keyword = ''}
    var regex = new RegExp(req.params.keyword);

    let users = await User.find({type: userRole.id}).populate('marital_status', 'status')
    .or([{ 'username': {$regex: regex}}, { 'name': {$regex: regex}}])
    .populate('type', 'role')
    .select('-password -createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted')
    .limit(100);

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
    .or([{ 'username': {$regex: regex}}, { 'name': {$regex: regex}}])
    .populate('type', 'role').select('-password -createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted')
    .limit(100);

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
    .or([{ 'username': {$regex: regex}}, { 'name': {$regex: regex}}])
    .populate('type', 'role')
    .select('-password -createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted')
    .limit(100);

    res.status(200).send({
        success: true,
        message: 'Police stations fetched successfully',
        data: police_stations
    })
});