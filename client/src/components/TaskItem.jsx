import React from 'react';

/**
 * Functional component representing an individual Task Card.
 * Contains display fields for task data, dynamic status selectors, and action buttons.
 * 
 * @param {object} task - Task document from database.
 * @param {function} onDelete - Triggers task removal in parent state.
 * @param {function} onUpdateStatus - Handles status toggling.
 * @param {function} onEdit - Passes task data to edit form.
 */
const TaskItem = ({ task, onDelete, onUpdateStatus, onEdit }) => {
  const { _id, title, description, status, dueDate } = task;

  // Format the MongoDB Date string into a human-readable layout (e.g. "Jun 28, 2026")
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Check if task is overdue (dueDate in past & status is not completed)
  const isOverdue = () => {
    if (!dueDate || status === 'completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dueDate) < today;
  };

  // Cycle task status to the next stage when clicking the badge
  const cycleStatus = () => {
    const statusCycle = {
      'pending': 'in-progress',
      'in-progress': 'completed',
      'completed': 'pending',
    };
    onUpdateStatus(_id, statusCycle[status]);
  };

  return (
    <article
      className="glass-panel animate-slide-in"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        position: 'relative',
        overflow: 'hidden',
        borderLeft: status === 'completed' 
          ? '6px solid var(--success)' 
          : status === 'in-progress' 
          ? '6px solid var(--info)' 
          : '6px solid var(--text-muted)',
        opacity: status === 'completed' ? 0.8 : 1,
        transition: 'all 0.3s ease',
      }}
    >
      {/* Task Card Header: Title & Badges */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <h3
          style={{
            margin: 0,
            fontSize: '1.15rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            textDecoration: status === 'completed' ? 'line-through' : 'none',
            wordBreak: 'break-word',
          }}
        >
          {title}
        </h3>
        
        {/* Interactive Badge: Click to cycle status */}
        <button
          onClick={cycleStatus}
          className={`badge badge-${status}`}
          title="Click to change status"
          style={{
            border: 'none',
            cursor: 'pointer',
            padding: '4px 10px',
            fontSize: '0.7rem',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {status.replace('-', ' ')}
        </button>
      </div>

      {/* Description Text */}
      {description && (
        <p
          style={{
            margin: 0,
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            textDecoration: status === 'completed' ? 'line-through' : 'none',
          }}
        >
          {description}
        </p>
      )}

      {/* Card Footer: Due Date & Action Buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'auto',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-color)',
        }}
      >
        {/* Due Date display */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isOverdue() ? 'var(--danger)' : 'var(--text-secondary)'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 500,
              color: isOverdue() ? 'var(--danger)' : 'var(--text-secondary)',
            }}
          >
            {formatDate(dueDate)}
            {isOverdue() && ' (Overdue)'}
          </span>
        </div>

        {/* Action Panel: Edit & Delete buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Edit Button */}
          <button
            onClick={() => onEdit(task)}
            className="btn-icon"
            title="Edit task"
            aria-label="Edit task"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>

          {/* Delete Button */}
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this task?')) {
                onDelete(_id);
              }
            }}
            className="btn-icon"
            title="Delete task"
            aria-label="Delete task"
            style={{ color: 'var(--danger-light)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--danger-light)')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
};

export default TaskItem;
