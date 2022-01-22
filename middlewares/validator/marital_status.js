const Joi = require('joi');

const create = Joi.object({
    body: Joi.object({
      status: Joi.string().required(),
    }).required()
});

const update = Joi.object({
    body: Joi.object({
      status: Joi.string(),
    }).required(),
});

module.exports = {create, update}