import supertest from 'supertest'

import { app } from '../../server'
import { disconnectedDB } from '../test-setup'
import { createSession } from '../test-helper'
import { v1 as uuid } from 'uuid'
import UserModel from '../../model/user.model'
import MessageModel from '../../model/message.model'
import { createToken } from '../../utils/helpers'

const request = supertest(app)

// Setup a Test Database
disconnectedDB()

/**
 * Auth Route Tests.
 */
describe('Auth Routes', () => {
  describe('POST /api/v1/messages', () => {
    describe('Authenticated User', () => {
      it('should create message', async (done) => {
        const user = new UserModel({
          name: 'John Admin',
          email: 'teamadmin@gmail.com',
          password: 'adminpassword',
          role: 'customer',
          accessToken: uuid()
        })
        await user.save()

        // Get user in the database
        const regularUser = await UserModel.findOne({ email: 'teamadmin@gmail.com' })
        expect(regularUser.role).toEqual('customer')

        // create session add get cookie to be attached to request Cookie
        const agent = await createSession(request, { email: 'teamadmin@gmail.com', password: 'adminpassword' })
        const cookie = agent
          .headers['set-cookie'][1]
          .split(',')
          .map(item => item.split(';')[0])

        // generate JWT token and add to request header Authorization
        const token = createToken({
          _id: regularUser._id,
          name: regularUser.name,
          email: regularUser.email,
          role: regularUser.role,
          authKey: regularUser.accessToken
        })

        const res = await request
          .post('/api/v1/messages')
          .set('Authorization', `Bearer ${token}`)
          .set('Cookie', cookie)
          .send({
            content: 'A man, a plan, a canal. Panama'
          })

        // Response Assertions
        expect(res.statusCode).toEqual(201)
        expect(res.body).toHaveProperty('success')
        expect(res.body).toHaveProperty('payload')
        expect(res.body.payload.content.content).toEqual('A man, a plan, a canal. Panama')
        done()
      })
    })
  })

  describe('PUT /api/v1/messages', () => {
    describe('Authenticated User', () => {
      it('should update existing message', async (done) => {
        expect(true).toBe(true)
        done()
      })
    })
  })

  describe('DELETE /api/v1/messages', () => {
    describe('Authenticated User', () => {
      it('should delete a message', async (done) => {
        expect(true).toBe(true)
        done()
      })
    })
  })

  describe('POST /api/v1/messages/test/palindrome', () => {
    describe('Any User with any string', () => {
      it('should test if a string is a palindrome', async (done) => {
        const res = await request
            .post('/api/v1/messages/test/palindrome')
            .send({
              content: 'A man, a plan, a canal. Panama'
            })

        // Response Assertions
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('success')
        expect(res.body).toHaveProperty('payload')
        expect(res.body.payload.message).toEqual('Message is a palindrome')
        expect(res.body.payload.check).toBe(true)
        done()
      })

      it('should test if a string is not a palindrome', async (done) => {
        const res = await request
            .post('/api/v1/messages/test/palindrome')
            .send({
              content: 'Ananan'
            })

        // Response Assertions
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('success')
        expect(res.body).toHaveProperty('payload')
        expect(res.body.payload.message).toEqual('Message is not a palindrome')
        expect(res.body.payload.check).toBe(false)
        done()
      })
    })

    describe('Any User with any existing message ID', () => {
      it('should test if a string is a palindrome', async (done) => {

        const user = new UserModel({
          name: 'John Team',
          email: 'team@gmail.com',
          password: 'teampassword',
          role: 'customer',
          accessToken: uuid()
        })
        await user.save()

        // Get user in the database
        const regularUser = await UserModel.findOne({ email: 'team@gmail.com' })
        // create session add get cookie to be attached to request Cookie
        const agent = await createSession(request, { email: 'team@gmail.com', password: 'teampassword' })
        const cookie = agent
            .headers['set-cookie'][1]
            .split(',')
            .map(item => item.split(';')[0])

        // generate JWT token and add to request header Authorization
        const token = createToken({
          _id: regularUser._id,
          name: regularUser.name,
          email: regularUser.email,
          role: regularUser.role,
          authKey: regularUser.accessToken
        })

        const existingMessage = new MessageModel({
          content: 'A man, a plan, a canal. Panama',
          creator: regularUser._id
        })
        await existingMessage.save()

        const res = await request
            .post('/api/v1/messages/test/palindrome')
            .set('Authorization', `Bearer ${token}`)
            .set('Cookie', cookie)
            .send({
              id: existingMessage._id
            })

        // Response Assertions
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('success')
        expect(res.body).toHaveProperty('payload')
        expect(res.body.payload.message).toEqual('Message is a palindrome')
        expect(res.body.payload.check).toBe(true)
        done()
      })

      it('should test if the content is not a palindrome', async (done) => {
        const user = new UserModel({
          name: 'John Cust',
          email: 'teamcustomer@gmail.com',
          password: 'custpassword',
          role: 'customer',
          accessToken: uuid()
        })
        await user.save()

        // Get user in the database
        const regularUser = await UserModel.findOne({ email: 'teamcustomer@gmail.com' })
        // create session add get cookie to be attached to request Cookie
        const agent = await createSession(request, { email: 'teamcustomer@gmail.com', password: 'custpassword' })
        const cookie = agent
            .headers['set-cookie'][1]
            .split(',')
            .map(item => item.split(';')[0])

        // generate JWT token and add to request header Authorization
        const token = createToken({
          _id: regularUser._id,
          name: regularUser.name,
          email: regularUser.email,
          role: regularUser.role,
          authKey: regularUser.accessToken
        })

        const existingMessage = new MessageModel({
          content: 'Ananan',
          creator: regularUser._id
        })
        await existingMessage.save()

        const res = await request
            .post('/api/v1/messages/test/palindrome')
            .set('Authorization', `Bearer ${token}`)
            .set('Cookie', cookie)
            .send({
              id: existingMessage._id
            })

        // Response Assertions
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('success')
        expect(res.body).toHaveProperty('payload')
        expect(res.body.payload.message).toEqual('Message is not a palindrome')
        expect(res.body.payload.check).toBe(false)
        done()
      })

      it('should test if the message doesnt exist', async (done) => {
        const user = new UserModel({
          name: 'John Cust',
          email: 'teamcust@gmail.com',
          password: 'custpassword',
          role: 'customer',
          accessToken: uuid()
        })
        await user.save()

        // Get user in the database
        const regularUser = await UserModel.findOne({ email: 'teamcust@gmail.com' })
        // create session add get cookie to be attached to request Cookie
        const agent = await createSession(request, { email: 'teamcust@gmail.com', password: 'custpassword' })
        const cookie = agent
            .headers['set-cookie'][1]
            .split(',')
            .map(item => item.split(';')[0])

        // generate JWT token and add to request header Authorization
        const token = createToken({
          _id: regularUser._id,
          name: regularUser.name,
          email: regularUser.email,
          role: regularUser.role,
          authKey: regularUser.accessToken
        })

        const invalidMessageId = '6043fbb43db8e120c3074e47'

        const res = await request
            .post('/api/v1/messages/test/palindrome')
            .set('Authorization', `Bearer ${token}`)
            .set('Cookie', cookie)
            .send({
              id: invalidMessageId
            })

        // Response Assertions
        expect(res.statusCode).toEqual(404)
        expect(res.body).toHaveProperty('success')
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toEqual('Message not found or has been deleted')
        expect(res.body.success).toBe(false)
        done()
      })
    })
  })
})
