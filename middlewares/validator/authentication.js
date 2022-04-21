const Joi = require('joi');

const login = Joi.object({
  body: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8)
  }).required()
});

const otpSignUp = Joi.object({
  body: Joi.object({
    phone: Joi.string().required()
  }).required()
});

const otpSignUpVerify = Joi.object({
  body: Joi.object({
    phone: Joi.string().required(),
    otp: Joi.string().required()
  }).required()
});

const signup = Joi.object({
    body: Joi.object({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      phone: Joi.string().required()
    }).required()
});

module.exports = {login, signup, otpSignUp, otpSignUpVerify}