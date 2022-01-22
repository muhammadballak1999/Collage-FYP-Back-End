const Joi = require('joi');

const create = Joi.object({
    body: Joi.object({
      longitude: Joi.number().required(),
      latitude: Joi.number().required(),
      police_station: Joi.string().required(),
      victim: Joi.string().required(),
      status: Joi.string().required(),
    }).required()
});

const update = Joi.object({
    body: Joi.object({
        longitude: Joi.number(),
        latitude: Joi.number(),
    }).required()
});

module.exports = {create, update}