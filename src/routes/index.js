import express from 'express'
import { handleServerResponse } from '../utils/helpers'

/**
 * Import Routes
 */
import authRoutes from './auth.routes'
import messageRoutes from './message.routes'

const router = express.Router()

/**
 * Route Blueprint Definitions
 *
 * Use API Routes
 */
router.use('/auth', authRoutes)
router.use('/messages', messageRoutes)

/* GET api home route. */
router.get('/', (req, res) => {
  return handleServerResponse(res, 'Welcome to the beginning of Nothingness 🚀')
})

export default router
