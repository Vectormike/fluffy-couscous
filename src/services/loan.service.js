/* eslint-disable prefer-const */
/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
const httpStatus = require('http-status');
const { Portfolio, Loan } = require('../models');
const { getPortfolioValue } = require('./portfolio.service');
const ApiError = require('../utils/ApiError');
const percentage = require('../utils/percentage');
const logger = require('../config/logger');

/**
 * Get a 60% loan
 * @param {Object} LoanBody
 * @returns {Promise<Portfolio>}
 */
const getLoan = async (loanBody, userID) => {
  const { percent, period } = loanBody;
  // fetch portfolio value and period input from User
  const { portfolioValue } = await getPortfolioValue(userID);

  // Calculate 60% from portfolio value
  const loanAmount = percentage(percent, portfolioValue);
  console.log(loanAmount);
  if (!loanAmount) {
    throw new Error('Can only give loans upto 60% of portfolio value');
  }

  // Disallow taking loan more than once
  const loaned = await Loan.findOne({ user: userID, status: 'loaned' });
  if (loaned) {
    return 'Outstanding Loan not paid';
  }

  const savedLoanDetails = new Loan({
    user: userID,
    loanAmount,
    loanPeriod: period,
  });

  await savedLoanDetails.save();

  return savedLoanDetails;
};

module.exports = { getLoan };
