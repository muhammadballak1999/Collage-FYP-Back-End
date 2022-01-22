const Joi = require('joi');

const create = Joi.object({
    body: Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
    }).required()
});

const update = Joi.object({
    body: Joi.object({
      title: Joi.string(),
      description: Joi.string(),
    }).required()
});

module.exports = {create}