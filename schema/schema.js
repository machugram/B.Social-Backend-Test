const { gql } = require('apollo-server')
const typeDefs = gql`
  type User {
    id: String!
    username: String
    email: String!
  }
  type AuthPayload {
    token: String
    user: User
    message:String
  }
  type Query {
    allUsers: [User]
  }
  type Mutation {
    registerUser(username: String, email: String!, password: String!): AuthPayload
    login (email: String!, password: String!): AuthPayload
  }
`
module.exports = typeDefs