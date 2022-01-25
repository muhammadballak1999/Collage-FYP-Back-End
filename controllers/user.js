const User = require("../models/user");
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
    let users = await User.find().select('-password').populate('type','role').sort({_id: -1}).exec();
    res.status(200).send({
        success: true,
        message: 'User fetched',
        data: users
    })
});