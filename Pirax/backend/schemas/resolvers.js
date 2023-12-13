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
        // Use the User model to find all users
        const allUsers = await User.find();
        return allUsers;
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
        // Create a new user using the User model
        const user = await User.create({ email, password });
        // Sign a JWT token for the new user
        const token = signToken({
          id: user._id,
          email: user.email, // Use email for token creation
        });
        // Return the token and user data
        return { token, user };
      } catch (error) {
        // Log and throw an error if there's an issue creating a user
        console.error("Error creating user:", error);
        throw new Error("Could not create user.");
      }
    },
    // Verify the user login
    loginUser: async (_parent, { email, password }) => {
      // Find the user document with the provided email
      const findUser = await User.findOne({ email });
      // Verify the correctness of the provided password
      const correctPw = await findUser.isCorrectPassword(password);

      // Throw an authentication error if the user is not found or if the password is incorrect
      if (!findUser || !correctPw) {
        throw new Error("Invalid credentials.");
      }

      // Sign a JWT token for the authenticated user
      const token = signToken(findUser);
      // Return the token and user data under the field 'user'
      return { token, user: findUser };
    },
  },
};

// Export the resolvers
module.exports = resolvers;
