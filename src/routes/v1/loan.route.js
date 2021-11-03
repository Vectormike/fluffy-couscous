const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const loanValidation = require('../../validations/loan.validation');
const loanController = require('../../controllers/loan.controller');

const router = express.Router();

router.route('/createLoan/').post(auth(), validate(loanValidation.getLoan), loanController.createLoan);
router.route('/getLoan/').get(auth(), loanController.getLoan);
router.route('/getPaymentSchedule/').get(auth(), loanController.getLoanPaymentSchedule);

module.exports = router;
