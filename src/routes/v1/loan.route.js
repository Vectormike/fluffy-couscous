const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const loanValidation = require('../../validations/loan.validation');
const loanController = require('../../controllers/loan.controller');

const router = express.Router();

router.route('/getLoan/:userID').post(auth(), validate(loanValidation.getLoan), loanController.createLoan);

module.exports = router;
