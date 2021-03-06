import express from 'express'

/**
 * Import Policies.
 */
import { addOrEditMessagePolicy, testMessagePolicy } from '../policies/message.policy'

/**
 * Import Controllers.
 */
import { createMessage, getMessages, updateMessage, removeMessage, isMessageAPalindrome } from '../controllers/message.controller'

/**
 * Import Middlewares.
 */
import { validateToken, validateSession } from '../utils/helpers'

const router = express.Router()

/**
 * Route Blueprint.
 */
// Authenticated Routes
router.get('/', validateSession, validateToken, getMessages)
router.get('/all', validateSession, validateToken, getMessages)
router.post('/', addOrEditMessagePolicy, validateSession, validateToken, createMessage)
router.put('/:id', addOrEditMessagePolicy, validateSession, validateToken, updateMessage)
router.delete('/:id', validateSession, validateToken, removeMessage)

// Unauthenticated Route
router.post('/test/palindrome', testMessagePolicy, isMessageAPalindrome)

export default router
