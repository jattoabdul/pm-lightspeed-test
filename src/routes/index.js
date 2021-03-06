import express from 'express'
import { handleServerResponse } from '../utils/helpers'

/**
 * TODO: Import Routes
 */

const router = express.Router()

/**
 * Route Blueprint Definitions
 *
 * Use API Routes
 */

/* GET api home route. */
router.get('/', (req, res) => {
  return handleServerResponse(res, 'Welcome to the beginning of Nothingness 🚀')
})

export default router
