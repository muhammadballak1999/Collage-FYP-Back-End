const Joi = require('joi');

const create = Joi.object({
  body: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    phone: Joi.string().required(),
    longitude: Joi.number().required(),
    latitude: Joi.number().required(),
  }).required()
});

const update = Joi.object({
  body: Joi.object({
    email: Joi.string().email(),
    password: Joi.string().min(8),
    phone: Joi.string(),
    longitude: Joi.number(),
    latitude: Joi.number(),
  }).required()
});

module.exports = {create, update}