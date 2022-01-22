const User = require("../models/user");
const AppError = require('../utils/appError');
const cloudinary = require('../utils/imageUpload');
const catchAsync  = require('../utils/catchAsync');
const bcrypt = require('bcrypt');

exports.create = catchAsync(async(req, res, next) => {
    // let user = {
    //     name: 'test',
    //     username: 'user',
    //     password: '11111111',
    //     phone: '7504976113',
    //     email: 'user@test.com',
    //     address: 'Minara 2',
    //     age: 22,
    //     city: 'Erbil',
    //     location: 'Minara Village 412 A',
    //     type: 'user'
    // }
    // bcrypt.hash(user.password, Number(process.env.saltRounds), async function(err, hash) {
    //     user.password = hash;
    //     await User.create(user);
    // });
    // res.status(200).send({
    //     success: true,
    //     message: 'User created',
    //     data: user
    // })
    console.log(req.body);
    console.log(req.file)
       res.status(200).send({
            success: true,
            message: 'Reached',
            data: []
        })
});

exports.get = catchAsync(async(req, res, next) => {
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