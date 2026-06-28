const Task = require('../models/Task');

/**
 * @desc    Get all tasks with optional search, filter, and sorting
 * @route   GET /api/tasks
 * @access  Public
 */
exports.getTasks = async (req, res, next) => {
  try {
    const { search, status, sort } = req.query;
    
    // Build a dynamic query object
    const queryObj = {};

    // 1. Search Logic: Match text against the task title (case-insensitive)
    if (search) {
      queryObj.title = { $regex: search, $options: 'i' };
    }

    // 2. Filter Logic: Match exact status value
    if (status && status !== 'all') {
      queryObj.status = status;
    }

    // Initialize the query execution
    let query = Task.find(queryObj);

    // 3. Sort Logic: Sort by specific criteria, defaulting to newest first (-createdAt)
    if (sort) {
      // Example: 'createdAt' (ascending), '-createdAt' (descending), 'title', 'dueDate'
      query = query.sort(sort);
    } else {
      query = query.sort('-createdAt');
    }

    // Execute the database query
    const tasks = await query;

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (err) {
    next(err); // Pass error to global error handler
  }
};

/**
 * @desc    Get a single task by ID
 * @route   GET /api/tasks/:id
 * @access  Public
 */
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error(`Task not found with id of ${req.params.id}`);
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Public
 */
exports.createTask = async (req, res, next) => {
  try {
    // Mongoose schema validations will trigger automatically upon Task.create
    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update an existing task
 * @route   PUT /api/tasks/:id
 * @access  Public
 */
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error(`Task not found with id of ${req.params.id}`);
    }

    // Update document using findByIdAndUpdate.
    // 'new: true' returns the updated document rather than the old one.
    // 'runValidators: true' forces Mongoose schema validations to run again during updates.
    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Public
 */
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error(`Task not found with id of ${req.params.id}`);
    }

    // Remove task from DB
    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}, // Return empty object indicating successful deletion
    });
  } catch (err) {
    next(err);
  }
};
