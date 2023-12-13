// Import necessary modules
const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const path = require("path");

// Load environment variables from .env file
require("dotenv").config();

// Import GraphQL schema and resolvers
const { typeDefs, resolvers } = require("./schemas");

// Import MongoDB connection
const db = require("./connection");

// Set the port for the Express server or use the default 3001
const PORT = process.env.PORT || 3001;

// Set the environment, default to 'development' if not provided
const NODE_ENV = process.env.NODE_ENV || "development";

// Create an Express application
const app = express();

// Create an instance of Apollo Server with the defined schema and resolvers
const server = new ApolloServer({ typeDefs, resolvers });

// Set up middleware to handle URL-encoded and JSON data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve static assets and handle routes in production
// This block will only execute if NODE_ENV is explicitly set to "production"
if (NODE_ENV === "production") {
  // Serve static files from the 'dist' directory
  app.use(express.static(path.join(__dirname, "../client/dist")));

  // Handle all other routes by serving the 'index.html' file
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
} else {
  // This block will execute when NODE_ENV is not "production"
  console.log(
    `Running in ${NODE_ENV} environment. Static assets and routes may not be configured for this environment.`
  );
}

// Use Apollo Server middleware at the '/graphql' endpoint
app.use("/graphql", expressMiddleware(server));

// Once the database connection is open, start the Express server
db.once("open", () => {
  app.listen(PORT, () => {
    // Log a message indicating the server is running
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
});
