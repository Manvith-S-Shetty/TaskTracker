import React from 'react';
import TaskItem from './TaskItem';

/**
 * Functional component hosting search filters, sorting options, and the task cards list.
 * Includes loading indicators and empty state layouts.
 * 
 * @param {array} tasks - List of task documents to render.
 * @param {boolean} loading - Loading indicator state.
 * @param {object} filters - Active filter settings: { search, status, sort }.
 * @param {function} onFilterChange - Updates filters in parent state.
 * @param {function} onDelete - Forwarded handler to delete cards.
 * @param {function} onUpdateStatus - Forwarded handler to update status.
 * @param {function} onEdit - Forwarded handler to enter edit mode.
 */
const TaskList = ({
  tasks,
  loading,
  filters,
  onFilterChange,
  onDelete,
  onUpdateStatus,
  onEdit,
}) => {
  
  // Handler for individual filter input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      [name]: value,
    });
  };

  return (
    <section>
      {/* Search, Filter & Sort Controls Panel */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {/* Search box input */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="search" className="form-label">Search Tasks</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                id="search"
                name="search"
                value={filters.search}
                onChange={handleInputChange}
                placeholder="Search by title..."
                className="form-input"
                style={{ paddingLeft: '2.25rem' }}
              />
              {/* Custom search magnifying glass SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--text-secondary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>

          {/* Status filtering dropdown */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="filterStatus" className="form-label">Filter by Status</label>
            <select
              id="filterStatus"
              name="status"
              value={filters.status}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Sorting dropdown */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="sort" className="form-label">Sort By</label>
            <select
              id="sort"
              name="sort"
              value={filters.sort}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="dueDate">Due Date (Ascending)</option>
              <option value="title">Title (A - Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading state indicator */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0', gap: '1rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '4px solid var(--border-color)',
              borderTop: '4px solid var(--primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Fetching tasks...</p>
          {/* Inject inline style rule keyframe for spin animation dynamically */}
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : tasks.length === 0 ? (
        // Empty task state illustration layout
        <div
          className="glass-panel"
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-muted)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>No Tasks Found</h3>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem', maxWidth: '300px' }}>
            There are no tasks matching your query. Add a new task above to get started!
          </p>
        </div>
      ) : (
        // Grid display representing active task items
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onDelete={onDelete}
              onUpdateStatus={onUpdateStatus}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default TaskList;
