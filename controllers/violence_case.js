const User = require("../models/user");
const ViolenceCase = require("../models/violence_case");
const CaseStatus = require("../models/case_status");
const PoliceStation = require("../models/police_station");
const Role = require("../models/role");
const AppError = require('../utils/appError');
const cloudinary = require('../utils/cloudinary');
const catchAsync  = require('../utils/catchAsync');
const { send_notification } = require("../utils/fcm");
const Excel = require('exceljs');
const fs = require('fs');
const path = require('path');


exports.get = catchAsync(async(req, res, next) => {

    let conditions = {isDeleted: false}
    if(req.decoded.type === 'police') {
        conditions = {...conditions, police_station: req.decoded.id}
    }

    let violence_cases = await ViolenceCase.find(conditions)
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

    let user = await User.findOne({_id: req.decoded.id, isSuspended: false})
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
          fcm_token_web: users[i].fcm_token_web,
          fcm_token_mobile: users[i].fcm_token_mobile,
          distance: calcCrow(lat, lng, users[i].police_station.latitude, users[i].police_station.longitude)
        });
    }

    let nearest_police_station = candidates.reduce(function(prev, curr) {
        return prev.distance < curr.distance ? prev : curr;
    });

    let pending = await CaseStatus.findOne({isDeleted: false, status: 'pending'})
    var violence_case = new ViolenceCase();
    violence_case.status = pending._id;
    violence_case.condition = req.body.condition;
    violence_case.latitude = req.body.latitude;
    violence_case.longitude = req.body.longitude;
    violence_case.victim = req.decoded.id; 
    violence_case.police_station = nearest_police_station.id
    violence_case.createdBy = req.decoded.id;


    await violence_case.save();
    user.case = violence_case.id
    user.isInDanger = true;
    await user.save();

    if(nearest_police_station.fcm_token_web)
    await send_notification('Warning', 'Someone is in danger', nearest_police_station.fcm_token_web, false);
    if(nearest_police_station.fcm_token_mobile)
    await send_notification('Warning', 'Someone is in danger', nearest_police_station.fcm_token_mobile, false);

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

exports.updateViolenceCaseStatus = catchAsync(async(req, res, next) => {

    let violence_case = await ViolenceCase.findOne({_id: req.params.id, isDeleted: false});
    let last_violence_case = await ViolenceCase.findOne({isDeleted: false}).sort({_id: -1});
    let user = await User.findOne({_id: violence_case.victim}).populate('case').exec();
    let userToEdit = await User.findOne({_id: violence_case.victim})
    let case_status = await CaseStatus.findOne({_id: req.params.status, isDeleted: false});
    
    if(user.case && user.case.id === violence_case.id && case_status.status !== 'pending') {
        userToEdit.isInDanger = false;
        userToEdit.case = null;
    } else if(user.isInDanger && user.case.id !== violence_case.id && case_status.status === 'pending') {
        res.status(403).send({
            success: false,
            error: true,
            message: 'alreadyInPending',
            data: {}
        })  
        return
    } else if(!user.isInDanger && violence_case.id !== last_violence_case.id && case_status.status === 'pending') {
        res.status(403).send({
            success: false,
            error: true,
            message: 'expiredCase',
            data: {}
        })  
        return

    } else if(!user.isInDanger && case_status.status === 'pending') {
        let aDayAgo = new Date(Date.now());
        aDayAgo.setHours(aDayAgo.getHours() - 24);
        if(aDayAgo > violence_case.createdAt) {
            res.status(403).send({
                success: false,
                error: true,
                message: 'expiredCase',
                data: {}
            })  
            return
        }

        userToEdit.isInDanger = true;
        userToEdit.case = violence_case._id;
    }

    if(!violence_case || !case_status) { 
        res.status(404).send({
            success: false,
            message: 'Violence Case or Case status was not found!',
            data: {}
        })  

        return
    }


    if(req.params.id !== req.params.status)
    {violence_case.status = case_status._id}



    violence_case.updatedBy = req.decoded.id;
    violence_case.updatedAt = new Date(Date.now());

    await violence_case.save();
    await userToEdit.save();

    res.status(200).send({
        success: true,
        message: 'Case updated successfully',
        data: violence_case
    })
});

exports.rejectViolenceCase = catchAsync(async(req, res, next) => {

    let reject_status = await CaseStatus.findOne({status:"rejected", isDeleted: false});
    let user = await User.findOne({_id: req.decoded.id}).populate('case');
    let userToEdit = await User.findOne({_id: req.decoded.id});
    let violence_case = await ViolenceCase.findOne({_id: user.case.id, isDeleted: false});

    violence_case.status = reject_status.id;
    userToEdit.case = null
    userToEdit.isInDanger = false;


    await violence_case.save();
    await userToEdit.save();

    res.status(200).send({
        success: true,
        message: 'Violence case was rejected',
        data: {}
    })  

})

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

exports.getReport = catchAsync(async(req, res, next) => {

    let from = new Date(Date.parse(req.params.from));
    let to = new Date(Date.parse(req.params.to));

    let violence_cases = await ViolenceCase.find({isDeleted: false, createdAt: {$gt: from, $lt: to}})
    .populate('victim', '-password -createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted -isSuspended -suspendedBy -suspendedAt')
    .populate('status', '-createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted')
    .populate({
        path: 'police_station',
        populate: {
            path: 'police_station',
        },
        select: "-password"
    })
    .select('-createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted -password')
    .exec();

    res.status(200).send({
        success: true,
        message: 'All violence cases fetched successfully',
        data: violence_cases
    });
});

exports.getCSV = catchAsync(async(req, res, next) => {

    let from = new Date(Date.parse(req.params.from));
    let to = new Date(Date.parse(req.params.to));

    let violence_cases = await ViolenceCase.find({isDeleted: false, createdAt: {$gt: from, $lt: to}})
    .populate('victim', '-password -createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted -isSuspended -suspendedBy -suspendedAt')
    .populate('status', '-createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted')
    .populate({
        path: 'police_station',
        populate: {
            path: 'police_station',
        },
        select: "-password"
    })
    .select('-createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted -password')
    .exec();


    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Debtors');


    worksheet.columns = [
        {header: 'Victim', key: 'victim'},
        {header: 'Police station', key: 'police_station'},
        {header: 'Status', key: 'status'},
        {header: 'Date of occurence', key: 'date'},
      ];

      worksheet.columns.forEach(column => {
        column.width = column.header.length < 12 ? 12 : column.header.length
      });

      violence_cases.forEach((e, index) => {
 
        const rowIndex = index + 2
        console.log(e, rowIndex)
        worksheet.addRow({
          victim: e.victim.name,
          police_station: e.police_station.name,
          status: e.status.status,
          date: e.createdAt
        })
      });
      worksheet.addRow({})
      worksheet.addRow({
        victim: `Total: ${violence_cases.length} cases`
      })

     await workbook.xlsx.writeFile('Report.xlsx');

     res.download(process.cwd()+'\\Report.xlsx');
    //  fs.unlinkSync(process.cwd()+'\\Report.xlsx');
      
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