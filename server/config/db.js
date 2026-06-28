const mongoose = require('mongoose');

/**
 * Establishes a connection to the MongoDB Database.
 * We use an async function because connecting to the database is an asynchronous network operation.
 */
const connectDB = async () => {
  try {
    // mongoose.connect returns a promise. We await it to ensure connection is established before proceeding.
    // process.env.MONGO_URI contains the connection credentials loaded by dotenv.
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // Fail fast: timeout after 10 seconds
      connectTimeoutMS: 10000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If the database fails to connect, log the error message
    console.error(`Database Connection Error: ${error.message}`);
    // Exit the Node process with code 1 (failure).
    // If the database cannot connect, the server cannot function, so we shut it down.
    process.exit(1);
  }
};

module.exports = connectDB;
