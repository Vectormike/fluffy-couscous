const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const portfolioSchema = mongoose.Schema(
  {
    user: {
      type: String,
      ref: 'User',
      required: true,
    },
    symbol: {
      type: String,
      required: true,
      trim: true,
    },
    totalQuantity: {
      type: Number,
      required: true,
    },
    equityValue: { type: Number, required: true },
    pricePerShare: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
portfolioSchema.plugin(toJSON);
portfolioSchema.plugin(paginate);

/**
 * Check if symbol is taken
 * @returns {Promise<boolean>}
 */
portfolioSchema.statics.isSymbolTaken = async function (symbol, excludeUserId) {
  const porfolio = await this.findOne({ symbol, _id: { $ne: excludeUserId } });
  return !!porfolio;
};

/**
 * @typedef Portfolio
 */
const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;
