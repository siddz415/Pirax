// Define a user schema using Mongoose Schema
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define the user schema with various fields
const userSchema = new mongoose.Schema({
  // Email address of the user (unique)
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // Password of the user (hashed and with minimum length)
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});
// Middleware: Execute before saving a user to hash the password
userSchema.pre("save", async function (next) {
  // Check if the password is new or has been modified
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 12; // Set the salt rounds for hashing
    this.password = await bcrypt.hash(this.password, saltRounds); // Hash the password using bcrypt
  }
  next(); // Continue with the save operation
});
// Method to compare an incoming password with the user's hashed password
userSchema.methods.isCorrectPassword = async function (password) {
  return await bcrypt.compare(password, this.password); // Compare the provided password with the stored hashed password
};
// Create a Mongoose model named 'User' using the userSchema
const User = mongoose.model("User", userSchema);
// Export the User model
module.exports = User;
