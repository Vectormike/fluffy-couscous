const httpStatus = require('http-status');
const ApiError = require('./ApiError');

const percentage = (percent = 60, value) => {
  return percent === 60 ? ((percent / 100) * value).toFixed(2) : null;
};

module.exports = percentage;
