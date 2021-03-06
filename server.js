const { ApolloServer, AuthenticationError } = require("apollo-server");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

// Import typeDefs and resolvers
const filePath = path.join(__dirname, "typeDefs.gql");
const typeDefs = fs.readFileSync(filePath, "utf-8");
const resolvers = require("./resolvers");

// Import Environment variables and Mongoose Models
require("dotenv").config({ path: "variables.env" });
const User = require("./models/User");
const Post = require("./models/Post");
const Category = require("./models/Category");

// Connect to mongo cloud db
mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("DB connected");
  })
  .catch(err => console.error(err));

// Verify JWT token passed from client
const getUser = async token => {
  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET)
    } catch (err) {
      throw new AuthenticationError('Your session has ended. Please sign in again.')
    }
  }
}

// Create Apollo/GraphQL server using typedefs, resolvers, and context object
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: error => ({
    name: error.name,
    message: error.message.replace('Context creation failed:', '')
  }),
  context: async ({ req }) => {
    const token = req.headers['authorization']
    return { User, Post, Category, currentUser: await getUser(token) }
  }
});

server.listen({ port: process.env.PORT || 4500 }).then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
