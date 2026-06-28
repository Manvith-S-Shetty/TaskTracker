const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middleware/errorHandler');

// 1. Load Environment Variables
// dotenv.config() loads key-value pairs from .env into process.env before executing application logic.
dotenv.config();

// 2. Establish Database Connection
// Run connectDB to establish connection with MongoDB before running the server.
connectDB();

// 3. Initialize Express App
const app = express();

// 4. Mount Global Middlewares
// Enable Cross-Origin Resource Sharing (CORS) so React client can fetch backend endpoints.
app.use(cors());

// Built-in Express middleware that parses incoming request payloads with JSON format.
// Replaces the old body-parser library. Populates 'req.body' with parsed JSON object.
app.use(express.json());

// 5. Mount API Routes
// Mount our task routers. All requests to '/api/tasks' will be forwarded to 'taskRoutes'.
app.use('/api/tasks', taskRoutes);

// Simple Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running smoothly' });
});

// 6. Mount Custom Error Handler Middleware
// Must be mounted AFTER mounting routes so it can catch routing errors.
app.use(errorHandler);

// 7. Bind Server to Port
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});

// Handle unhandled promise rejections (e.g. database connection failures not caught in try-catch)
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
