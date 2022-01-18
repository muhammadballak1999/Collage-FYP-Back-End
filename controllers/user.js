const User = require("../models/user");
const AppError = require('../utils/appError');
const cloudinary = require('../utils/imageUpload');
const catchAsync  = require('../utils/catchAsync');
const bcrypt = require('bcrypt');

exports.createUser = catchAsync(async(req, res, next) => {
    let user = {
        name: 'test',
        username: 'admin',
        password: '11111111',
        phone: '7503558405',
        email: 'admin@test.com',
        address: 'Minara 2',
        age: 22,
        city: 'Erbil',
        location: 'Minara Village 412 A',
        type: 'admin'
    }
    bcrypt.hash(user.password, 10, async function(err, hash) {
        user.password = hash;
        await User.create(user);
    });
    res.status(200).send({
        success: true,
        message: 'User created',
        data: user
    })
});

exports.getUsers = catchAsync(async(req, res, next) => {
    let users = await User.find();
    bcrypt.compare('1111111', users[0].password, function(err, result) {
        console.log(result);
    });
    res.status(200).send({
        success: true,
        message: 'User fetched',
        data: users
    })
});