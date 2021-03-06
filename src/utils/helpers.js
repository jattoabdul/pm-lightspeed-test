import 'regenerator-runtime/runtime.js'

import { isString, isObject } from './validator'


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
