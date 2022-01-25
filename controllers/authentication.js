const User = require("../models/user");
const AppError = require('../utils/appError');
const catchAsync  = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.login = catchAsync(async(req, res, next) => {

    let user = await User.findOne({email: req.body.email}).populate('type','role').exec();
    if(!user) {
        next(new AppError('User doesnt exist with such credentials', 404));
        return
    }

    let result = await bcrypt.compare(req.body.password, user.password);

    if(!result) {
        next(new AppError('Wrong credentials', 403));
        return
    }

    var token = await jwt.sign({
        id: user._id, 
        email: user.email,
        username: user.username, 
        type: user.type.role, 
        police_station_id: user.type.role ===  'police' ? user.police_station : undefined
    }, 
    process.env.secret_token_key);

    res.status(200).send({
        success: true,
        message: 'User logged in',
        data: {
            accessToken: token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                type: user.type.role,
                police_station_id: user.type.role ===  'police' ? user.police_station : undefined
            }
        }   
    });
});

exports.signup = catchAsync(async(req, res, next) => {

    if(!req.body.email || !req.body.password) {
        next(new AppError('Email, password and phone number are required!', 403));
        return
    }

    if(req.body.password.length <  8) {
        next(new AppError('password must be at least 8 characters!', 403));
        return
    }

    bcrypt.hash(user.password, 10, async function(err, hash) {
        await User.create({
            email: req.body.email,
            password: hash
        });
    });
    res.status(200).send({
        success: true,
        message: 'User signed up'
    });    

});