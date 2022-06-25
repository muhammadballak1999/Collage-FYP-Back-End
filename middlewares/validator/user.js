const Joi = require('joi');

const create = Joi.object({
    body: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().allow('').allow(null),
      password: Joi.string().required(),
      location: Joi.string().allow('').allow(null),
      city: Joi.string().required(),
      longitude: Joi.number().allow(null),
      latitude: Joi.number().allow(null),
      phone: Joi.string().required(),
      type: Joi.string().required(),
      marital_status: Joi.string().allow(null)
    }).required()
});

const update = Joi.object({
    body: Joi.object({
        name: Joi.string(),
        email: Joi.string().allow('').allow(null),
        password: Joi.string().allow('').allow(null),
        location: Joi.string().allow('').allow(null),
        city: Joi.string(),
        longitude: Joi.number().allow(null),
        latitude: Joi.number().allow(null),
        phone: Joi.string(),
        marital_status: Joi.string().allow(null)
    }).required(),
});

module.exports = {create, update}