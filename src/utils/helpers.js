import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'regenerator-runtime/runtime.js'

import { isString, isObject } from './validator'

import config from './../config'
import User from './../model/user.model'

/**
 * Request and Response Handlers.
 */
/**
 * @desc This is a logger method
 * @function log
 * @param {*} data error data
 * @param {*} logType could be info, debug, success, table
 */
export const log = (data, logType = 'info') => {
  if (logType === 'error') {
    console.error(data)
  } else if (logType === 'info') {
    console.info(data)
  } else {
    console.log(data)
  }
}

/**
 * @desc Handles our Application Server Response Messages
 * @param {*} res response object from server
 * @param {*} data response object
 * @param {Number} status
 * @returns {*} server response
 */
export const handleServerResponse = (res, data, status = 200) => {
  if (isString(data)) {
    return res.status(status).json({ message: data })
  } else if (isObject(data)) {
    const { success, payload, meta } = data
    return res.status(status).json({
      success,
      meta,
      payload
    })
  } else {
    return res.status(status).send(data)
  }
}

/**
 * @desc Sends our Application Server Response Messages
 * @param {*} req request object
 * @param {*} res response object
 * @returns {*} server response
 */
export const sendResponse = (req, res) => {
  const payload = req.payload

  return handleServerResponse(res, {
    success: true,
    payload
  })
}

/**
 * @desc Handles our Application Server Error Messages
 * @param {*} response response object from server
 * @param {*} msg error message
 * @param {*} status response status code
 * @returns {*} error response
 */
export const handleServerError = (response, msg, status = 500) => {
  return response.status(status || 500).send({
    success: false,
    message: msg
  })
}

/**
 * App Wide Helpers.
 */

/**
 * @function cleanAString
 * @param {String} str string length
 * @returns {String} Strip non-alphanumeric characters anc convert to lowercase
 */
export const cleanAString = (str) => str.toLowerCase().replace(/[\W_]/g, '')

/**
 * @function isPalindrome
 * @param {String} word string length
 * @returns {Boolean} true if word is a palindrome or false if not
 */
export const isPalindrome = (word) => {
  const cleanedStr = cleanAString(word)

  for (let index = 0; index < cleanedStr.length / 2; index++) {
    if (cleanedStr[index] !== cleanedStr[cleanedStr.length - 1 - index]) {
      return false
    }
  }
  return true
}


/**
 * Auth Helpers.
 */

/**
 * @function hashPassword
 * @param {string} password password to be hashed
 * @description hashes a password with bcrypt
 * @returns {string} password hash
 */
export const hashPassword = password => {
  const saltRounds = config.saltRounds
  return bcrypt.hashSync(password, parseInt(saltRounds, 10))
}

/**
 * @function checkPassword
 * @param {string} password in ordinary form
 * @param {string} hash password hash form
 * @description checks if a password corresponds with saved hash in db
 * @returns {boolean} true if correct of false if incorrect
 */
export const checkPassword = (password, hash) => bcrypt.compareSync(password, hash)

/**
 * @function createToken
 * @param {object} data user object from database
 * @description creates new jwt token for authentication
 * @returns {String} newly created jwt
 */
export const createToken = (data) => {
  data.created = Date.now()
  data.expiresBy = Date.now() + (config.tokenLifespan)

  data.issuedEnv = config.environment

  return jwt.sign({ ...data }, config.tokenSecret)
}

/**
 * @function validateSession
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {object | RequestHandler} response object
 * @description check if session is active
 */
export const validateSession = async (req, res, next) => {
  if (req.session.accessToken) {
    return next()
  }
  return handleServerError(res, 'Your Session has expired, Please Re-login', 401)
}

/**
 * @function validateToken
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {object | RequestHandler} response object
 * @description check if jwt token is appended in header
 */
export const validateToken = async (req, res, next) => {
  let token = req.headers.authorization || req.headers['x-access-token']

  if (token) {
    if (req.headers.authorization) {
      if (token.includes('Bearer ')) {
        token = token.replace('Bearer ', '')
      }
    }
    try {
      const decoded = jwt.verify(token, config.tokenSecret)

      if (!decoded._id) return handleServerError(res, 'token has no id!', 403)

      const user = await User.findById(decoded._id).select('accessToken')

      if (!user) return handleServerError(res, 'User not found or has been removed', 401)

      if (!user.accessToken || req.session.accessToken !== decoded.authKey || user.accessToken !== decoded.authKey) {
        return handleServerError(res, 'invalid/expired session and token', 401)
      }

      req.user = decoded

      return next()
    } catch (err) {
      return handleServerError(res, 'Invalid auth token', 401)
    }
  }
  return handleServerError(res, 'You have to be loggedin first', 401)
}

/**
 * @function decodeToken
 * @param {*} token user token to be decoded
 * @returns {object | RequestHandler} response object
 * @description decodes Token if jwt token is appended in header
 */
export const decodeToken = async token => {
  if (!token) return {}
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.tokenSecret, (err, decoded) => {
      if (err) {
        reject(err)
      } else {
        resolve(decoded)
      }
    })
  })
}

/**
 * @desc ensure request is made by an admin
 * @function isAdmin
 * @param {object} req request object
 * @param {object} res response object
 * @param {Function} next Next middleware callback
 * @returns {*} next middleware or error response
 */
export const isAdmin = async (req, res, next) => {
  const {
    role
  } = req.user

  if (role && role.toLowerCase().includes('admin')) {
    return next()
  } else {
    return handleServerError(res, 'Only an admin can perform this operation', 401)
  }
}

/**
 @desc ensure request is made by a super admin
 * @function isSuperAdmin
 * @param {object} req request object
 * @param {object} res response object
 * @param {Function} next Next middleware callback
 * @returns {*} next middleware or error response
 */
export const isSuperAdmin = async (req, res, next) => {
  const {
    role
  } = req.user

  if (role && role.toLowerCase() === 'super_admin') {
    return next()
  } else {
    return handleServerError(res, 'Only special admins can perform this operation', 401)
  }
}
