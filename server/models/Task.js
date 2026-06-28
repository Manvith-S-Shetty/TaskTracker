const mongoose = require('mongoose');

/**
 * Schema defining the shape and validations of a Task document in MongoDB.
 */
const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['pending', 'in-progress', 'completed'],
        message: 'Status must be: pending, in-progress, or completed',
      },
      default: 'pending',
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    // Automatically generates 'createdAt' and 'updatedAt' Date fields for each document
    timestamps: true,
  }
);

// Compiles and exports the Task model using mongoose.model
// The first parameter 'Task' is the singular name of the collection. Mongoose automatically makes it plural ('tasks') in MongoDB.
module.exports = mongoose.model('Task', TaskSchema);
