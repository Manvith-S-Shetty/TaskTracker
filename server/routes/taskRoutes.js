const express = require('express');
const router = express.Router();

// Import controller handlers for CRUD operations
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

// Route configurations

// 1. Group operations for root path: '/api/tasks'
router.route('/')
  .get(getTasks)      // GET request fetches all tasks (supports query strings)
  .post(createTask);  // POST request creates a new task

// 2. Group operations for ID-specific path: '/api/tasks/:id'
router.route('/:id')
  .get(getTask)       // GET request fetches a single task by its id
  .put(updateTask)    // PUT request updates task details by id
  .delete(deleteTask); // DELETE request removes the task by id

module.exports = router;
