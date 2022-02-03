const User = require("../models/user");
const Role = require("../models/role");
const AppError = require('../utils/appError');
const cloudinary = require('../utils/cloudinary');
const catchAsync  = require('../utils/catchAsync');
const bcrypt = require('bcrypt');

exports.create = catchAsync(async(req, res, next) => {
    let user = {
        name: 'test',
        username: 'admin',
        password: '11111111',
        phone: '7504976113',
        email: 'admin@test.com',
        address: 'Minara 2',
        age: 22,
        city: 'Erbil',
        location: 'Minara Village 412 A',
        type: '61eff99b65053310b5a9afe8'
    }
    bcrypt.hash(user.password, Number(process.env.saltRounds), async function(err, hash) {
        user.password = hash;
        await User.create(user);
    });
    res.status(200).send({
        success: true,
        message: 'User created',
        data: user
    })
});

exports.get = catchAsync(async(req, res, next) => {

    let admin = await Role.findOne({role: 'admin'}).select('id');
    let user = await Role.findOne({role: 'user'}).select('id');
    let police = await Role.findOne({role: 'police'}).select('id');

    let admins = await User.find({type: admin.id}).populate('type', 'role').select('-password -createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted').limit(100);
    let users = await User.find({type: user.id}).populate('type', 'role').select('-password -createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted').limit(100);
    let police_stations = await User.find({type: police.id}).populate('type', 'role').select('-password -createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted').limit(100);


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

exports.getUsers = catchAsync(async(req, res, next) => {

    let userRole = await Role.findOne({role: 'user'}).select('id');
    if(req.params.keyword==='undefined'){req.params.keyword = ''}
    var regex = new RegExp(req.params.keyword);

    let users = await User.find({type: userRole.id})
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
    
    let admins = await User.find({type: adminRole.id })
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

    let police_stations = await User.find({type: policeRole.id})
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