const Joi = require('joi');

const create = Joi.object({
    body: Joi.object({
      content: Joi.string().required(),
    }).required(),
});

const update = Joi.object({
    body: Joi.object({
      content: Joi.string().required(),
    }).required(),
});

module.exports = { update, create }