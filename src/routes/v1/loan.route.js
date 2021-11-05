const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const loanValidation = require('../../validations/loan.validation');
const loanController = require('../../controllers/loan.controller');

const router = express.Router();

router.route('/createLoan/').post(auth(), validate(loanValidation.getLoan), loanController.createLoan);
router.route('/getLoan/').get(auth(), loanController.getLoan);
router.route('/getPaymentSchedule/').get(auth(), loanController.getLoanPaymentSchedule);
router.route('/payLoan/').post(auth(), loanController.payLoan);
router.route('/completePayLoan/').post(auth(), loanController.completeTransaction);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Loan
 *   description: Get a 60% loan based on Portfolio value
 */

/**
 * @swagger
 * /loan/createLoan:
 *   post:
 *     summary: Create Loan
 *     tags: [Loan]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - period
 *             properties:
 *               period:
 *                 type: number
 *                 description: Period of month(s) for loan
 *             example:
 *               period: 12
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 loan:
 *                   $ref: '#/components/schemas/Loan'
 *       "400":
 *         $ref: '#/components/responses/Error'
 */

/**
 * @swagger
 * loan/getLoan/:
 *   get:
 *     summary: Get Loan value
 *     description: Logged in users can fetch only their own loan balance and details.
 *     tags: [Loan]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Loan'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * loan/getPaymentSchedule/:
 *   get:
 *     summary: Get Loan schedule
 *     description: View or get a prorated payment schedule over the loan period
 *     tags: [Loan]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/LoanSchedule'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * loan/payLoan/:
 *   get:
 *     summary: Pay Loan
 *     description: Payback his loan through any payment providers, please note using payment provider
 *      test bed is perfectly acceptable provided it works end to end.
 *     tags: [Loan]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - card_number
 *               - cvv
 *               - expiry_year
 *               - expiry_month
 *               - pin
 *             properties:
 *               card_number:
 *                 type: string
 *               cvv:
 *                 type: string
 *               expiry_year:
 *                 type: string
 *               expiry_month:
 *                 type: string
 *               pin:
 *                 type: string
 *             example:
 *               card_number: 5531886652142950
 *               cvv: 564
 *               expiry_year: 32
 *               expiry_month: 039
 *               pin: 3310
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/LoanSchedule'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * loan/completePayLoan/:
 *   get:
 *     summary: Complete Payment
 *     description: Input otp
 *     tags: [Loan]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               otp:
 *                 type: string
 *             example:
 *               otp: 12345
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Loan'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
