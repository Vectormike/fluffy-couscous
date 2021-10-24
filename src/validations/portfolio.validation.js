const Joi = require('joi');

const createPortfolio = {
  body: Joi.object().keys({
    symbol: Joi.string().required(),
    totalQuantity: Joi.number().required(),
    equityValue: Joi.number().required(),
    pricePerShare: Joi.number().required(),
  }),
};

module.exports = { createPortfolio };
