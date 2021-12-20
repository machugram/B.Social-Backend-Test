const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/user')
require('dotenv').config()
const resolvers = {
    Query: {
      
    },
    Mutation: {
      async registerUser(_, { username, email, password }) {
        
        try {
          const foundUser = await User.findOne({email:email})
          if(foundUser){
            console.log(foundUser);
            return {
              user:foundUser, message: "User already exists. Forgot Password?"
            }
          }
          const user = await User.create({
            username,
            email,
            password: await bcrypt.hash(password, 10)
          })
          console.log(user)

          const token = jsonwebtoken.sign(
            { id: user.id, email: user.email},
            process.env.JWT_SECRET,
            { expiresIn: '1y' }
          )
          console.log(token)
          return {
            token, id: 89900, username: username, email: email, message: "Authentication succesfull"
          }
        } catch (error) {
            console.log(error)
          throw new Error(error.message)
        }
      },
      async login(_, { email, password }) {
        try {
          console.log("Hi")
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