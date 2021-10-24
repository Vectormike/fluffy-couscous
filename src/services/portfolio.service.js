const httpStatus = require('http-status');
const { Portfolio } = require('../models');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

/**
 * Create a Portfolio
 * @param {Object} portfolioBody
 * @returns {Promise<Portfolio>}
 */
const createPortfolio = async (portfolioBody, userId) => {
  if (await Portfolio.isSymbolTaken(portfolioBody.symbol)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Symbol already taken');
  }
  const portfolio = new Portfolio({
    symbol: portfolioBody.symbol,
    totalQuantity: portfolioBody.totalQuantity,
    equityValue: portfolioBody.equityValue,
    pricePerShare: portfolioBody.pricePerShare,
    user: userId,
  });
  await portfolio.save();
  return portfolio;
};
module.exports = { createPortfolio };
