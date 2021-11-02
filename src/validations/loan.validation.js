const Joi = require('joi');

const getLoan = {
  body: Joi.object().keys({
    period: Joi.number().required(),
  }),
};

module.exports = { getLoan };
