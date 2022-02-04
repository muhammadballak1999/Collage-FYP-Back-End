const Joi = require('joi');

const create = Joi.object({
    body: Joi.object({
      name: Joi.string().required(),
      username: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
      location: Joi.string().allow(null),
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
        username: Joi.string(),
        email: Joi.string(),
        password: Joi.string(),
        location: Joi.string(),
        city: Joi.string(),
        longitude: Joi.number().allow(null),
        latitude: Joi.number().allow(null),
        phone: Joi.string(),
        type: Joi.string(),
        marital_status: Joi.string().allow(null)
    }).required(),
});

module.exports = {create, update}