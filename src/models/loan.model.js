const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const loanSchema = mongoose.Schema(
  {
    user: {
      type: String,
      ref: 'User',
      required: true,
    },
    loanAmount: {
      type: String,
      required: true,
    },
    loanPeriod: {
      type: Number,
      required: true,
    },
    loanBalancePaid: {
      type: String,
      default: 'Loan not paid yet!',
    },
    paymentSchedule: {
      type: Number,
    },
    status: {
      type: String,
      required: true,
      default: 'active',
    },
    paymentRef: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
loanSchema.plugin(toJSON);
loanSchema.plugin(paginate);

// /**
//  * Check if symbol is taken
//  * @returns {Promise<boolean>}
//  */
// loanSchema.statics.isSymbolTaken = async function (symbol, excludeUserId) {
//   const porfolio = await this.findOne({ symbol, _id: { $ne: excludeUserId } });
//   return !!porfolio;
// };

/**
 * @typedef Loan
 */
const Loan = mongoose.model('Loan', loanSchema);

module.exports = Loan;
