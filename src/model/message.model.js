import { Schema, model } from 'mongoose'
import { isValidId } from "../utils/validator";

const { ObjectId } = Schema.Types

/**
 * User Model Schema.
 */
const messageSchema = new Schema({
  content: {
    type: String,
    required: 'Message Content is Required'
  },
  creator: {
    type: ObjectId,
    required: 'Message Creator is required',
    validate: [isValidId, 'Please use a valid user ID'],
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
})

messageSchema.pre('save', function (next) {
  const message = this
  message.updatedAt = Date.now()

  return next()
})

messageSchema.index({ creator: 1, content: 1 }, { key: 'content_creator', unique: true })
/**
 * Message Model Table.
 */
const MessageModel = model('Message', messageSchema)

export default MessageModel
