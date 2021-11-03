/* eslint-disable no-bitwise */
const paymentSchedule = (loanAmount, loanPeriod) => {
  function float2int(value) {
    return value | 0;
  }
  const amount = float2int(loanAmount);

  return amount / loanPeriod;
};

module.exports = paymentSchedule;
