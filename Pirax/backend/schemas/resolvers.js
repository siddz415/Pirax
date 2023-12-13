// Import necessary modules and dependencies
const { User } = require("../models");
const { signToken } = require("../utils/auth");

// Define GraphQL resolvers
const resolvers = {
  // Query resolvers handle data fetching
  Query: {
    // Resolver for fetching all users
    users: async () => {
      try {
        // Using the User model to find all users
        return await User.find();
      } catch (error) {
        // Log and throw any errors that occur during the query
        console.error("Error during user fetch:", error);
        throw new Error("An error occurred while fetching users.");
      }
    },
  },
  // Mutation resolvers handle data modification
  Mutation: {
    // Add a new user to the database
    addUser: async (_parent, { email, password }) => {
      try {
        const user = await User.create({ email, password });
        console.log("Created user:", user);
        const token = signToken({
          id: user._id,
          email: user.email, // Use email for token creation
        });
        console.log("Created token:", token);
        return { token, user };
      } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Could not create user.");
      }
    },
  },
};

// Export the resolvers
module.exports = resolvers;
