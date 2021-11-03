/* eslint-disable no-unused-expressions */
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { loanService, emailService } = require('../services');

const createLoan = catchAsync(async (req, res) => {
  const loan = await loanService.createLoan(req.body, req.user._id);

  // Send email for confirmation

  loan.loanAmount === 1
    ? res.status(httpStatus.CREATED).send({
        message: `Loan was succesful and you should get a loan of ${loan.loanAmount} for a period of ${loan.loanPeriod} month`,
        loan,
      })
    : res.status(httpStatus.CREATED).send({
        message: `Loan was succesful and you should get a loan of ${loan.loanAmount} for a period of ${loan.loanPeriod} months`,
        loan,
      });
});

const getLoan = catchAsync(async (req, res) => {
  const loan = await loanService.getLoanBalance(req.user._id);

  // Send email for confirmation

  res.status(httpStatus.OK).send({
    loan,
  });
});

const getLoanPaymentSchedule = catchAsync(async (req, res) => {
  const paymentSchedule = await loanService.getLoanPaymentSchedule(req.user._id);

  // Send email for confirmation

  res.status(httpStatus.OK).send({
    paymentSchedule,
  });
});

module.exports = { createLoan, getLoan, getLoanPaymentSchedule };
