const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const portfolioValidation = require('../../validations/portfolio.validation');
const portfolioController = require('../../controllers/portfolio.controller');

const router = express.Router();

router.route('/create').post(auth(), validate(portfolioValidation.createPortfolio), portfolioController.createPortfolio);

router.route('/getValue/:userID').get(auth(), portfolioController.getPortfoilioValue);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Portfolio
 *   description: Portfolio
 */

/**
 * @swagger
 * /portfolio/create:
 *   post:
 *     summary: Create Portfolio
 *     tags: [Portfolio]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - symbol
 *               - totalQuantity
 *               - equityValue
 *               - pricePerShare
 *             properties:
 *               symbol:
 *                 type: string
 *                 description: Company name for an Equity
 *               totalQuantity:
 *                 type: number
 *                 description: Quantity held for an Equity
 *               equityValue:
 *                 type: number
 *                 description: Equity value
 *               pricePerShare:
 *                  type: number
 *                  description: Price per Equity
 *             example:
 *               symbol: AMZN
 *               totalQuantity: 10
 *               equityValue: 10000
 *               pricePerShare: 100
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 portfolio:
 *                   $ref: '#/components/schemas/Portfolio'
 *       "400":
 *         $ref: '#/components/responses/DuplicateSymbol'
 */

/**
 * @swagger
 * portfolio/getValue/{userID}:
 *   get:
 *     summary: Get Portfolio value
 *     description: Logged in users can fetch only their own portfolio value.
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
