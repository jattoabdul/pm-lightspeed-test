import Joi from '@hapi/joi'
import { handleServerError } from '../utils/helpers'

/**
 * @function
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description enforce policies for createMessage/updateMessage input
 * @returns {Response | RequestHandler} error or request handler
 */
export const addOrEditMessagePolicy = (req, res, next) => {
  const { content } = req.body

  const schema = Joi.object({
    content: Joi.string().required()
  })

  const { error } = schema.validate({ content })

  if (error) {
    console.log(JSON.stringify(error, null, 2))
    return handleServerError(res, error.details[0].message, 400)
  }

  return next()
}

/**
 * @function
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description enforce policies for message palindrome test input
 * @returns {Response | RequestHandler} error or request handler
 */
export const testMessagePolicy = (req, res, next) => {
  const { id, content } = req.body

  const schema = Joi.object()
    .keys({
      id: Joi.string(),
      content: Joi.string()
    })
    .xor('id', 'content')

  const { error } = schema.validate({ id, content })

  if (error) {
    console.log(JSON.stringify(error, null, 2))
    return handleServerError(res, error.details[0].message, 400)
  }

  return next()
}
