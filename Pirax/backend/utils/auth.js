// Use dotenv to load the secret from the .env file
require("dotenv").config();

// Import necessary modules
const jwt = require("jsonwebtoken");
// Set the expiration time for JWT (JSON Web Token)
const expiration = "2h";
// Extract the secret key from the environment variables
const secret = process.env.SECRET_KEY;

// Export an instance of AuthenticationError with a specific error message for GraphQL
module.exports = {
  // Middleware function to handle user authentication
  authMiddleware: function ({ req }) {
    // Extract the token from different parts of the request
    let token = req.body.token || req.query.token || req.headers.authorization;

    // Check if the request includes an authorization header
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim(); // Update the 'token' variable with the cleaned-up token
    }

    // If no token is found, return the request object as is
    if (!token) {
      return req;
    }

    try {
      // Verify the token using the secret key and set user data in the request
      const decodedToken = jwt.verify(token, secret, { maxAge: expiration });
      req.user = decodedToken.data;
    } catch (error) {
      console.log("Invalid token", error);
    }

    return req; // Return the modified request object
  },
  // Function to sign a JWT token with user information
  signToken: function ({ email, username, _id }) {
    // Create a payload with user information
    const payload = { email, username, _id };
    // Sign the token with the payload, secret key, and expiration time
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
