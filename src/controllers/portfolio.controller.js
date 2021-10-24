const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { portfolioService, emailService } = require('../services');

const createPortfolio = catchAsync(async (req, res) => {
  const portfolio = await portfolioService.createPortfolio(req.body, req.user._id);
  // Send email for confirmation

  res.status(httpStatus.CREATED).send({ portfolio });
});

module.exports = { createPortfolio };
