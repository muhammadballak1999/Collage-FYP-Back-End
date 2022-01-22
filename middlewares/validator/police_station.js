const Joi = require('joi');

const create = Joi.object({
    body: Joi.object({
      longitude: Joi.number().required(),
      latitude: Joi.number().required(),
    }).required()
  });

module.exports = {create}