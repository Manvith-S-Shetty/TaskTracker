import React, { useState, useEffect } from 'react';

/**
 * Functional component representing the form used to create or edit tasks.
 * Performs client-side validation before sending payloads up.
 * 
 * @param {function} onSubmit - Parent handler for creating/updating a task.
 * @param {object|null} editingTask - Task object if in Edit Mode, null if in Create Mode.
 * @param {function} onCancelEdit - Clears the editing state in the parent.
 */
const TaskForm = ({ onSubmit, editingTask, onCancelEdit }) => {
  // Input fields states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [dueDate, setDueDate] = useState('');
  
  // Client-side validation errors state
  const [errors, setErrors] = useState({});

  // useEffect triggers when 'editingTask' changes.
  // It handles switching the form layout between Create Mode and Edit Mode.
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setStatus(editingTask.status);
      
      // HTML input[type="date"] expects the date format 'YYYY-MM-DD'
      if (editingTask.dueDate) {
        const date = new Date(editingTask.dueDate);
        const formattedDate = date.toISOString().split('T')[0];
        setDueDate(formattedDate);
      } else {
        setDueDate('');
      }
      setErrors({});
    } else {
      // Clear form when exiting edit mode
      resetForm();
    }
  }, [editingTask]);

  // Helper to reset all input fields to defaults
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('pending');
    setDueDate('');
    setErrors({});
  };

  // Perform frontend client-side validation
  const validateForm = () => {
    const tempErrors = {};
    if (!title.trim()) {
      tempErrors.title = 'Task title is required';
    } else if (title.length > 100) {
      tempErrors.title = 'Title cannot exceed 100 characters';
    }
    setErrors(tempErrors);
    // If tempErrors is empty, form is valid
    return Object.keys(tempErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Stop standard browser page refresh

    if (validateForm()) {
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        status,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      };

      onSubmit(taskData);
      
      // If we are in Create Mode (not editing), reset the form inputs after successful submission
      if (!editingTask) {
        resetForm();
      }
    }
  };

  return (
    <section className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
        {editingTask ? '📝 Edit Task' : '➕ Create New Task'}
      </h2>

      <form onSubmit={handleSubmit} noValidate>
        {/* Title Input */}
        <div className="form-group">
          <label htmlFor="title" className="form-label">Task Title *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="form-input"
            style={{ borderColor: errors.title ? 'var(--danger)' : 'var(--border-color)' }}
          />
          {errors.title && <span className="form-error">{errors.title}</span>}
        </div>

        {/* Description Textarea */}
        <div className="form-group">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add some details..."
            className="form-textarea"
          />
        </div>

        {/* Dynamic Fields row: Status & Due Date */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
          {/* Status Dropdown - Always visible but defaulted for convenience */}
          <div className="form-group">
            <label htmlFor="status" className="form-label">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="form-select"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Due Date Picker */}
          <div className="form-group">
            <label htmlFor="dueDate" className="form-label">Due Date</label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        {/* Form Actions Panel */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
          {editingTask && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="btn btn-secondary"
            >
              Cancel Edit
            </button>
          )}
          
          <button type="submit" className="btn btn-primary">
            {editingTask ? 'Update Task' : 'Add Task'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default TaskForm;
