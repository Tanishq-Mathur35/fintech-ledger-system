const { Router } = require("express")
const authMiddleware = require("../middleware/auth.middleware")
const transactionController = require("../controllers/transaction.controller")



const transactionRoutes = Router()


/**
 * - POST /api/transactions/
 * - Create a new transcation
 */
transactionRoutes.post("/", authMiddleware.authMiddleware, transactionController.createTransaction)


/**
 * - POST /api/transcations/system/initial-funds
 * Create initial funds transaction from system user
 */
transactionRoutes.post("/system/initial-funds", authMiddleware.systemUserMiddleware, transactionController.createInitialFundsTransaction)


module.exports = transactionRoutes
