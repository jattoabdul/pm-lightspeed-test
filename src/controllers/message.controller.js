import crypto from 'crypto'
import redis from "redis"

import {
  isPalindrome,
  handleServerError,
  handleServerResponse
} from '../utils/helpers'
import config from "../config"

import MessageModel from '../model/message.model'


const redisURL = config.redisURL
const redisClient = redis.createClient(redisURL)

/**
 * @method createMessage
 * @param { object } req
 * @param { object } res
 * @returns {handleServerResponse | handleServerError} return the response
 * @description receives message details via parsed body and create an instance of the Message Model in the database
 */
export const createMessage = async (req, res) => {
  try {
    const { content } = req.body

    // create new message instance
    const newMessage = await new MessageModel({
      creator: req.user._id,
      content
    }).save()

    return handleServerResponse(res, {
      success: true,
      payload: {
        message: 'Message created successfully 😊',
        content: newMessage
      }
    }, 201)
  } catch (err) {
    return handleServerError(res, err)
  }
}

/**
 * @method updateMessage
 * @param { object } req
 * @param { object } res
 * @returns {handleServerResponse | handleServerError} return the response
 * @description updates message details with parsed body for id in query param
 */
export const updateMessage = async (req, res) => {
  try {
    const {
      id
    } = req.params
    const { content } = req.body

    // check if message exists
    let messageExist = await MessageModel.findOne({
      _id: id,
      creator: req.user._id
    })

    if (!messageExist) return handleServerError(res, 'Message does not exist', 404)

    if (content) messageExist.content = content

    messageExist = await messageExist.save()

    return handleServerResponse(res, {
      success: true,
      payload: {
        message: 'Update successful',
        content: messageExist
      }
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}

/**
 * @method removeMessage
 * @desc removes message supplied by id from query params
 * @param {object} req request from client from client
 * @param {object} res response from server containing deleted category as payload if successful
 */
export const removeMessage = async (req, res) => {
  try {
    const {
      id
    } = req.params

    // check if message exists
    const message = await MessageModel.findOne({
      _id: id,
      creator: req.user._id
    })
      .select('-__v')

    if (!message) return handleServerError(res, 'Message not found or has been deleted', 404)

    await message.remove()

    return handleServerResponse(res, {
      success: true,
      payload: {
        deleted: message
      }
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
/**
 * @method getMessages
 * @desc fetch all messages
 * @param {object} req request from client
 * @param {object} res response from server
 */
export const getMessages = async (req, res) => {
  try {
    const messages = await MessageModel.find({
      creator: req.user._id
    })
      .select('-__v')
      .populate('creator', '-__v -password')

    return handleServerResponse(res, {
      success: true,
      payload: {
        messages
      }
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}

/**
 * @method isMessageAPAlindrome
 * @param { object } req
 * @param { object } res
 * @returns {handleServerResponse | handleServerError} return the response
 * @description checks if a message is a palindrome
 */
export const isMessageAPalindrome = async (req, res) => {
  try {
    const { id, content } = req.body
    let wordCheck = false
    let isFromCache = false
    let wordToBeChecked = ''

    if (id) {
      // check if message exists
      const message = await MessageModel.findOne({
        _id: id
      })

      if (!message) return handleServerError(res, 'Message not found or has been deleted', 404)
      wordToBeChecked = message.content
    } else if (content) {
      wordToBeChecked = content
    } else {
      return handleServerError(res, 'Message ID or Content is required', 403)
    }

    // hash the wordToBeChecked
    let hashedWord = crypto.createHash('md5').update(wordToBeChecked).digest("hex")

    // Try to get wordCheck for hashedWord from redis
    redisClient.get(hashedWord, (err, data) => {
      if (err) throw err

      // if data found in redis, return cached wordCheck value for hashedWord
      if (data) {
        wordCheck = data === "true"
        isFromCache = true
      } else {
        // else if not found in cache, get wordCheck value for new hashedWord
        wordCheck = isPalindrome(wordToBeChecked)
        // set wordCheck value for hashedWord in redis
        redisClient.setex(hashedWord, 3600, JSON.stringify(wordCheck));
        isFromCache = false
      }

      return handleServerResponse(res, {
        success: true,
        payload: {
          message: wordCheck ? 'Message is a palindrome' : 'Message is not a palindrome',
          check: wordCheck,
          isFromCache: isFromCache
        }
      })
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
