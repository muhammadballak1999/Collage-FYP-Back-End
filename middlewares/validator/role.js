const Joi = require('joi');

const create = Joi.object({
    body: Joi.object({
      role: Joi.string().required(),
    }).required()
});

const update = Joi.object({
    body: Joi.object({
        role: Joi.string(),
    }).required(),
});

module.exports = {create, update}