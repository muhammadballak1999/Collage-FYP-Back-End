const User = require("../models/user");
const ViolenceCase = require("../models/violence_case");
const PoliceStation = require("../models/police_station");
const Role = require("../models/role");
const AppError = require('../utils/appError');
const cloudinary = require('../utils/cloudinary');
const catchAsync  = require('../utils/catchAsync');

exports.get = catchAsync(async(req, res, next) => {

    let violence_cases = await ViolenceCase.find({isDeleted: false})
    .populate('victim', '-password -createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted -isSuspended -suspendedBy -suspendedAt')
    .populate('status', '-createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted')
    .populate({
        path: 'police_station',
        populate: {
            path: 'police_station',
        }
    })
    .select('-createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted')

    
    .sort({_id: -1})
    .exec();

    res.status(200).send({
        success: true,
        message: 'All violence cases fetched successfully',
        data: violence_cases
    });
});

exports.getOne = catchAsync(async(req, res, next) => {

    let violence_case = await ViolenceCase.findOne({_id: req.params.id, isDeleted: false})
    .populate('victim', '-password -createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted')
    .populate('status')
    .populate({
        path: 'police_station',
        populate: {
            path: 'police_station',
        }
    })
    .select('-createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted')
    .sort({_id: -1})
    .exec();

    if(violence_case) {
        res.status(200).send({
            success: true,
            message: 'Violence case fetched successfully',
            data: violence_case
        });
        return
        }

        res.status(404).send({
            success: false,
            message: 'No blog was found!',
            data: {}
        })


});

exports.create = catchAsync(async(req, res, next) => {

    let police = await Role.findOne({role: 'police'})
    .select('-createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted');

    let users = await User.find({isDeleted: false, isSuspended: false, type: police.id})
    .select('-createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted')
    .populate('police_station', 'latitude longitude');

    var lat = Number(req.body.latitude);
    var lng = Number(req.body.longitude);

    let candidates = []

    for(let i = 0; i<users.length; i++) {
      candidates.push({
          id: users[i].id,
          distance: calcCrow(lat, lng, users[i].police_station.latitude, users[i].police_station.longitude)
        });
    }

    let nearest_police_station = candidates.reduce(function(prev, curr) {
        return prev.distance < curr.distance ? prev : curr;
    });


    var violence_case = new ViolenceCase();
    violence_case.status = '62094e1b2a7408420eda5c58';
    violence_case.condition = req.body.condition;
    violence_case.latitude = req.body.latitude;
    violence_case.longitude = req.body.longitude;
    violence_case.victim = req.decoded.id; 
    violence_case.police_station = nearest_police_station.id
    violence_case.createdBy = req.decoded.id;

    await violence_case.save();

    res.status(200).send({
        success: true,
        message: 'Case created successfully',
        data: violence_case
    })


});

exports.update = catchAsync(async(req, res, next) => {

    let violence_case = await ViolenceCase.findOne({_id: req.params.id, isDeleted: false});

    if(!violence_case) { 
        res.status(404).send({
            success: false,
            message: 'No case was found!',
            data: {}
        })  
    }

    if(req.body.condition && violence_case.condition !== req.body.condition)
    {violence_case.condition = req.body.condition}

    if(req.body.latitude && violence_case.latitude !== req.body.latitude)
    {violence_case.latitude = req.body.latitude}

    if(req.body.longitude && violence_case.longitude !== req.body.longitude)
    {violence_case.longitude = req.body.longitude}

    if(req.body.status && violence_case.status !== req.body.status)
    {violence_case.status = req.body.status}

    violence_case.updatedBy = req.decoded.id;
    violence_case.updatedAt = new Date(Date.now());

    await violence_case.save();

    res.status(200).send({
        success: true,
        message: 'Case updated successfully',
        data: violence_case
    })
});

exports.delete = catchAsync(async(req, res, next) => {
    let violence_case = await ViolenceCase.findOne({_id: req.params.id, isDeleted: false});

    if(!violence_case) { 
        res.status(404).send({
            success: false,
            message: 'No case was found!',
            data: {}
        })  
        return
    }

    violence_case.isDeleted = true;
    violence_case.deletedBy = req.decoded.id;
    violence_case.deletedAt = new Date(Date.now());

    await violence_case.save();


    res.status(200).send({
        success: true,
        message: 'Case deleted successfully',
        data: violence_case
    })
});



function calcCrow(lat1, lon1, lat2, lon2) 
{
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
function toRad(Value) 
{
    return Value * Math.PI / 180;
}