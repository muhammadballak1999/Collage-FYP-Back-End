const PoliceStation = require("../models/police_station");
const User = require("../models/user");
const AppError = require('../utils/appError');
const cloudinary = require('../utils/cloudinary');
const catchAsync  = require('../utils/catchAsync');
const bcrypt = require('bcrypt');

exports.get = catchAsync(async(req, res, next) => {

});

exports.getOne = catchAsync(async(req, res, next) => {

});

exports.create = catchAsync(async(req, res, next) => {
    let police = {
        name: 'test',
        username: 'police',
        password: '11111111',
        phone: '7504885947',
        email: 'police@test.com',
        address: 'Minara 2',
        age: 22,
        city: 'Erbil',
        location: 'Minara Village 412 A',
        type: 'police',
        police_station: null
    }
    bcrypt.hash(police.password, Number(process.env.saltRounds), async function(err, hash) {
        police.password = hash;
        let police_station = await PoliceStation.create({
            longitude: 28.1000000,
            latitude: 29.1000000
          });
        police.police_station = police_station.id
        await User.create(police);
    });
    res.status(200).send({
        success: true,
        message: 'User created',
        data: police
    })
});


exports.update = catchAsync(async(req, res, next) => {

});

exports.delete = catchAsync(async(req, res, next) => {

});