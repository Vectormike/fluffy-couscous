const percentage = (percent, value) => {
  return ((percent / 100) * value).toFixed(2);
};

module.exports = percentage;
