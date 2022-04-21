const User = require("../models/user");
const Role = require('../models/role')
const PreSignUp = require('../models/pre_signup')
const AppError = require('../utils/appError');
const catchAsync  = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {send_message} = require('../utils/twilio');


exports.login = catchAsync(async(req, res, next) => {

    let user = await User.findOne({email: req.body.email}).populate('type','role').exec();
    if(!user) {
        res.status(404).send({
            success: false,
            message: 'User doesnt exist with such credentials!',
            data: {}
        });
        return
    }

    if(user.isSuspended) {
        res.status(401).send({
            success: false,
            message: 'User is deactivated!',
            data: {}
        });
        return
    }

    let result = await bcrypt.compare(req.body.password, user.password);

    if(!result) {
        res.status(403).send({
            success: false,
            message: 'Wrong credentials',
            data: {}
        });
        return
    }

    var token = await create_token(user);

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

exports.otpSignup = catchAsync(async(req, res, next) => {
    let user = await User.findOne({phone: req.body.phone});
    if(user) {
      res.status(403).send({
            success: false,
            message: 'User already exist with such credentials!',
            data: {}
        });
        return
    }

    let pre = await PreSignUp.findOne({phone: req.body.phone})
    var otp;

    if(pre){
        if(!pre.otp || new Date().setHours(new Date().getHours() + 3) > pre.expire_otp_date){
        otp = Math.floor(100000 + Math.random() * 900000);
        pre.otp = otp;
        pre.expire_otp_date = new Date().setHours(new Date().getHours() + 4);
        await pre.save();
        send_message(`Your parez verification code is ${pre.otp}`, pre.phone);
        res.status(200).send({
            success: true,
            message: 'Message send with otp code',
            data: pre  
        });
        } else {
            res.status(200).send({
                success: true,
                message: 'Message send wih otp code',
                data: pre  
            });
            send_message(`Your parez verification code is ${pre.otp}`, pre.phone);
        }
   } else {
        let pre_user = new PreSignUp();
        pre_user.phone = req.body.phone;
        otp = Math.floor(100000 + Math.random() * 900000);
        pre_user.otp = otp;
        pre_user.expire_otp_date = new Date().setHours(new Date().getHours() + 4); 
        await pre_user.save();
        send_message(`Your parez verification code is ${pre_user.otp}`, pre_user.phone);
        res.status(200).send({
        success: true,
        message: 'Message send with otp code',
        data: pre_user  
    });
   }

})

exports.otpSignupResend = catchAsync(async(req, res, next) => {
    let pre = await PreSignUp.findOne({phone: req.body.phone})
    var otp;

    if(pre){
        if(!pre.otp || new Date().setHours(new Date().getHours() + 3) > pre.expire_otp_date){
        otp = Math.floor(100000 + Math.random() * 900000);
        pre.otp = otp;
        pre.expire_otp_date = new Date().setHours(new Date().getHours() + 4);
        await pre.save();
        send_message(`Your parez verification code is ${pre.otp}`, pre.phone);
        res.status(200).send({
            success: true,
            message: 'Message send with otp code',
            data: pre  
        });
        } else {
            res.status(200).send({
                success: true,
                message: 'Message send wih otp code',
                data: pre  
            });
            send_message(`Your parez verification code is ${pre.otp}`, pre.phone);
        }
    }
    })

exports.otpSignUpVerify = catchAsync(async(req, res, next) => {
    let pre = await PreSignUp.findOne({phone: req.body.phone});
    
    if(pre.otp !== req.body.otp) {
        res.status(401).send({
            success: false,
            message: 'Wrong OTP!',
            data: {}
        });
        return
    }

    if(new Date().setHours(new Date().getHours() + 3) > pre.expire_otp_date) {
        res.status(401).send({
            success: false,
            message: 'OTP expired!',
            data: {}
        });
        return
    }
    let user_type = await Role.findOne({role: 'user'});
    let user = new User();
    user.name = "";
    user.phone = req.body.phone;
    user.type = 'user';
    let token = await create_token({
        _id: user._id, 
        email: user.email,
        type: {role: 'user'},
        isDeactivated: false
    });
    user.type = user_type._id;
    user.save();
    res.status(200).send({
        success: true,
        message: 'User created successfuly',
        data: {
            accessToken: token,
        }
    })
    
})

exports.otp = catchAsync(async(req, res, next) => {
    let role = await Role.findOne({role: 'user'});
    let user = await User.findOne({phone: req.params.phone, type: role._id});
    if(!user) {
        res.status(404).send({
            success: false,
            message: 'User doesnt exist with such credentials!',
            data: {}
        });
        return
    }

    if(user.isSuspended) {
        res.status(404).send({
            success: false,
            message: 'User is deactivated!',
            data: {}
        });
        return
    }

    var otp;
    if(!user.otp || new Date().setHours(new Date().getHours() + 3) > user.expire_otp_date){
    otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = otp;
    user.expire_otp_date = new Date().setHours(new Date().getHours() + 4);
    await user.save();
    }

    send_message(`Your parez verification code is ${user.otp}`, user.phone);
    res.status(200).send({
        success: true,
        message: 'message send successfuly',
        data: {}
    })
});


exports.verify_otp = catchAsync(async(req, res, next) => {
    
    let user_type = await Role.findOne({role: 'user'});
    let user = await User.findOne({phone: req.params.phone, type: user_type._id}).populate('type','role').exec();;

    if(!user) {
        res.status(404).send({
            success: false,
            message: 'User doesnt exist with such credentials!',
            data: {}
        });
        return
    }

    if(user.otp !== req.params.otp) {
        res.status(401).send({
            success: false,
            message: 'Wrong OTP!',
            data: {}
        });
        return
    }

    if(new Date().setHours(new Date().getHours() + 3) > user.expire_otp_date) {
        res.status(401).send({
            success: false,
            message: 'OTP expired!',
            data: {}
        });
        return
    }

    let token = await create_token(user);

    user.otp = null;
    user.expire_otp_date = null;
    await user.save();

    res.status(200).send({
        success: true,
        message: 'User logged in',
        data: {
            accessToken: token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
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


async function create_token(user) {
   return await jwt.sign({
        id: user._id, 
        email: user.email,
        type: user.type.role,
        police_station_id: user.type.role ===  'police' ? user.police_station : undefined,
        isDeactivated: user.isDeactivated
    }, 
    process.env.secret_token_key);
}