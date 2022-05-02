const Joi = require('joi');

const create = Joi.object({
    body: Joi.object({
      title: Joi.string().required(),
      content: Joi.string().required(),
    }).required()
});

const update = Joi.object({
    body: Joi.object({
      title: Joi.string(),
      content: Joi.string(),
    }).required()
});

module.exports = {create, update}