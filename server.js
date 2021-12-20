const { ApolloServer } = require('apollo-server')
const jwt =  require('jsonwebtoken')
const mongoose = require('mongoose')
const typeDefs = require('./schema/schema')
const resolvers = require('./resolvers/resolvers')
require('dotenv').config()
const { PORT,DBURL } = process.env
mongoose
  .connect(DBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    throw new Error(error);
  });
const server = new ApolloServer({
  typeDefs,
  resolvers
})
server.listen({ port: PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});