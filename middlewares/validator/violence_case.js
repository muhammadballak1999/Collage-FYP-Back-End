const Joi = require('joi');

const create = Joi.object({
    body: Joi.object({
      condition: Joi.string().allow(null).allow(''),
      longitude: Joi.number().required(),
      latitude: Joi.number().required(),
    }).required()
});

const update = Joi.object({
    body: Joi.object({
        condition: Joi.string().allow(null).allow(''),
        longitude: Joi.number(),
        latitude: Joi.number(),
    }).required()
});

module.exports = {create, update}