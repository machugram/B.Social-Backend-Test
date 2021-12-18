const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/user')
require('dotenv').config()
const resolvers = {
    Query: {},
    Mutation: {
      async registerUser({ username, email, password }) {
        try {
        const findUser = await User.findOne({ email: email})
        if(findUser){
            return {
            id: findUser.id, username: findUser.username, email: findUser.email, message: "Email is already used. Forgot Password?"
            }
        }
          const user = await User.create({
            username,
            email,
            password: await bcrypt.hash(password, 10)
          })
          const token = jsonwebtoken.sign(
            { id: user.id, email: user.email},
            process.env.JWT_SECRET,
            { expiresIn: '1y' }
          )
          return {
            token, id: user.id, username: user.username, email: user.email, message: "Authentication succesfull"
          }
        } catch (error) {
            console.log(error)
          throw new Error(error.message)
        }
      },
      async login(_, { email, password }) {
        try {
          const user = await User.findOne({ email: email})
          console.log(user);

          if (!user) {
            throw new Error('No user with that email')
          }
          const isValid = await bcrypt.compare(password, user.password)
          if (!isValid) {
            throw new Error('Incorrect password')
          }
          // return jwt
          const token = jsonwebtoken.sign(
            { id: user.id, email: user.email},
            process.env.JWT_SECRET,
            { expiresIn: '1d'}
          )
          message = "Logged In"
          return {
           token, user,message
          }
      } catch (error) {
        throw new Error(error.message)
      }
    }
  },

}
module.exports = resolvers