/* eslint-disable no-unused-expressions */
/* eslint-disable no-plusplus */
/* eslint-disable camelcase */
/* eslint-disable eqeqeq */
/* eslint-disable no-console */
/* eslint-disable prefer-const */
/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
const httpStatus = require('http-status');
const Flutterwave = require('flutterwave-node-v3');
const open = require('open');
const config = require('../config/config');

const flw = new Flutterwave(config.flutterwave.public, config.flutterwave.secret);
const { Portfolio, Loan, User } = require('../models');
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

  return { balance: loanDetails.loanBalancePaid, loan: loanDetails };
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

  // Get Payment schedule
  const payment = paymentSchedule(loanAmount, loanPeriod);

  loanDetails.paymentSchedule = payment;
  loanDetails.save();

  return { loanAmount, loanPeriod, payment };
};

/**
 * Get loan payment schedule
 * @param {Object}
 * @returns {Promise<>}
 */
const payLoan = async (loanBody, userID) => {
  const { phoneNumber, pin, card_number, cvv, expiry_year, expiry_month } = loanBody;

  const loanDetails = await Loan.findOne({ user: userID, status: 'active' });
  const userDetails = await User.findOne({ _id: userID });

  const payPayLoad = {
    phone_number: phoneNumber,
    card_number,
    cvv,
    expiry_month,
    expiry_year,
    currency: 'NGN',
    amount: loanDetails.paymentSchedule,
    enckey: config.flutterwave.encKey,
    authorization: {
      mode: 'pin',
      pin,
    },
    tx_ref: 'MC-MC-1585230ew9v5050e8', // This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
    email: userDetails.email,
    fullname: userDetails.name,
  };

  const chargeResp = await flw.Charge.card(payPayLoad);

  loanDetails.paymentRef = chargeResp.data.flw_ref;

  if (chargeResp.status != 'error') {
    if (loanDetails.loanBalancePaid == 'Loan not paid yet!') {
      loanDetails.loanBalancePaid = loanDetails.paymentSchedule;
      loanDetails.save();
      return;
    }

    const newBalance = Number(loanDetails.loanBalancePaid) + Number(loanDetails.paymentSchedule);
    loanDetails.loanBalancePaid = newBalance;
    loanDetails.save();

    return loanDetails;
  }
  logger.error(chargeResp, 'Hi');
  throw new ApiError(httpStatus.UNAUTHORIZED, 'Unable to pay loan');
};

const completeTransaction = async (loanBody, userID) => {
  try {
    const loanDetails = await Loan.findOne({ user: userID, status: 'active' });

    const callValidate = await flw.Charge.validate({
      otp: loanBody.otp,
      flw_ref: loanDetails.paymentRef,
    });
    if (callValidate.message == 'Charge validated') {
      loanDetails.loanPeriod == 0 ? (loanDetails.status = 'inactive') : loanDetails.loanPeriod--;
      loanDetails.save();
      return { loanDetails, callValidate };
    }
  } catch (error) {
    logger.error(error);
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Transaction unsucessful!');
  }
};

module.exports = { createLoan, getLoanBalance, getLoanPaymentSchedule, payLoan, completeTransaction };
