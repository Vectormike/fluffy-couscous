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

/**
 * Get Portfolio value
 * @param {Object} portfolioBody
 * @returns {Promise<Portfolio>}
 */
const getPortfolioValue = async (userID) => {
  // fetch portfolio based on user
  const portfolio = await Portfolio.find({ user: userID });

  // add equity values
  const reducer = (previousValue, currentValue) => previousValue + currentValue;

  const values = portfolio.map((data) => data.equityValue);

  const portfolioValue = values.reduce(reducer);

  // return

  return { portfolioValue, ...portfolio };
};

/**
 * Get Portfolio value
 * @param {Object} portfolioBody
 * @returns {Promise<Portfolio>}
 */
const getLoan = async (userID) => {
  // fetch portfolio based on user
  const portfolio = await Portfolio.find({ user: userID });

  // add equity values
  const reducer = (previousValue, currentValue) => previousValue + currentValue;

  const values = portfolio.map((data) => data.equityValue);

  const portfolioValue = values.reduce(reducer);

  // return

  return { portfolioValue, ...portfolio };
};

module.exports = { createPortfolio, getPortfolioValue, getLoan };
