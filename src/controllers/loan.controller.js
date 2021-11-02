/* eslint-disable no-unused-expressions */
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { loanService, emailService } = require('../services');

const createLoan = catchAsync(async (req, res) => {
  const loan = await loanService.getLoan(req.body, req.user._id);

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

module.exports = { createLoan };
