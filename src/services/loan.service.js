/* eslint-disable prefer-const */
/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
const httpStatus = require('http-status');
const { Portfolio, Loan } = require('../models');
const { getPortfolioValue } = require('./portfolio.service');
const ApiError = require('../utils/ApiError');
const percentage = require('../utils/percentage');
const paymentSchedule = require('../utils/paymentSchedule');
const logger = require('../config/logger');

/**
 * Demand a 60% loan
 * @param {Object} LoanBody
 * @returns {Promise<LoanDetails>}
 */
const createLoan = async (loanBody, userID) => {
  const { percent, period } = loanBody;
  // fetch portfolio value and period input from User
  const { portfolioValue } = await getPortfolioValue(userID);

  // Calculate 60% from portfolio value
  const loanAmount = percentage(percent, portfolioValue);
  if (!loanAmount) {
    throw new Error('Can only give loans upto 60% of portfolio value');
  }

  // Disallow taking loan more than once
  const loaned = await Loan.findOne({ user: userID, status: 'active' });
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

/**
 * Get loan balance
 * @param {Object}
 * @returns {Promise<>}
 */
const getLoanBalance = async (userID) => {
  // Fetch loan using userID
  const loanDetails = await Loan.findOne({ user: userID, status: 'active' });

  if (!loanDetails) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Loan not found');
  }

  return { balance: loanDetails.loanBalancePaid, loan: loanDetails.loanAmount };
};

/**
 * Get loan payment schedule
 * @param {Object}
 * @returns {Promise<>}
 */
const getLoanPaymentSchedule = async (userID) => {
  // Fetch Loan details
  const loanDetails = await Loan.findOne({ user: userID, status: 'active' });
  if (!loanDetails) {
    throw new Error('Loan has been fully paid');
  }

  const { loanAmount, loanBalancePaid, loanPeriod } = loanDetails;

  // Get Paymnet schedule
  const payment = paymentSchedule(loanAmount, loanPeriod);

  return { loanAmount, loanPeriod, payment };
};

module.exports = { createLoan, getLoanBalance, getLoanPaymentSchedule };
