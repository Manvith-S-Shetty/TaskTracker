import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import ThemeToggle from './components/ThemeToggle';
import Toast from './components/Toast';
import { api } from './utils/api';

/**
 * Root Controller Component.
 * Coordinates global state (tasks, loading, editing, filters, toasts),
 * runs backend integrations, and structures the primary dashboard grid.
 */
const App = () => {
  // Application State
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [toast, setToast] = useState(null);
  
  // Filter panel state
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    sort: '-createdAt',
  });

  // Helper to trigger floating toast alerts
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Fetch tasks list from the REST API
  const loadTasks = async () => {
    setLoading(true);
    try {
      const response = await api.getTasks(filters);
      setTasks(response.data);
    } catch (err) {
      showToast(err.message || 'Failed to fetch tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  // useEffect manages fetching tasks from the database.
  // We implement a debounce mechanism for the 'search' query to prevent sending
  // HTTP requests to MongoDB on every single keystroke.
  useEffect(() => {
    // 1. Debounce logic: Set a timer to execute fetching tasks after 350ms
    const delayDebounceFn = setTimeout(() => {
      loadTasks();
    }, 350);

    // 2. Cleanup: If the user types another letter before 350ms passes,
    // this cleanup function clears the previous timer, starting a new one.
    return () => clearTimeout(delayDebounceFn);
  }, [filters]); // Refetches only when search, status, or sort changes

  // Create or Update task handler
  const handleCreateOrUpdateTask = async (taskData) => {
    try {
      if (editingTask) {
        // Edit Mode: Update database document
        const response = await api.updateTask(editingTask._id, taskData);
        
        // Update local tasks state immediately for dynamic UI update
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t._id === editingTask._id ? response.data : t))
        );
        showToast('Task updated successfully!', 'success');
        setEditingTask(null);
      } else {
        // Create Mode: Save new document
        const response = await api.createTask(taskData);
        
        // Append newly created task to state for instant rendering without page reload
        setTasks((prevTasks) => [response.data, ...prevTasks]);
        showToast('Task added successfully!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  // Delete task handler
  const handleDeleteTask = async (id) => {
    try {
      await api.deleteTask(id);
      // Remove deleted item from local state array instantly
      setTasks((prevTasks) => prevTasks.filter((t) => t._id !== id));
      showToast('Task deleted successfully!', 'success');
      
      // If the deleted task was currently being edited, reset the form
      if (editingTask && editingTask._id === id) {
        setEditingTask(null);
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete task', 'error');
    }
  };

  // Direct status toggler from Task Cards
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await api.updateTask(id, { status: newStatus });
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === id ? response.data : t))
      );
      showToast(`Task marked as ${newStatus.replace('-', ' ')}`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  // Triggered when edit button is clicked on a card
  const handleEditClick = (task) => {
    setEditingTask(task);
    // Premium UX detail: smooth scroll back to top so form is clearly visible
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel active edit state
  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  return (
    <div className="container animate-fade-in">
      {/* Dashboard Top Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2.5rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '2.25rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, var(--primary), #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
            }}
          >
            TaskFlow
          </h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Elevate your daily productivity
          </p>
        </div>
        <ThemeToggle />
      </header>

      {/* Primary Dashboard Grid: Form column & List column */}
      <main
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start',
        }}
      >
        {/* Left Form Column */}
        <div style={{ position: 'sticky', top: '24px' }}>
          <TaskForm
            onSubmit={handleCreateOrUpdateTask}
            editingTask={editingTask}
            onCancelEdit={handleCancelEdit}
          />
        </div>

        {/* Right List Column */}
        <div style={{ gridColumn: 'span 2' }}>
          <TaskList
            tasks={tasks}
            loading={loading}
            filters={filters}
            onFilterChange={setFilters}
            onDelete={handleDeleteTask}
            onUpdateStatus={handleUpdateStatus}
            onEdit={handleEditClick}
          />
        </div>
      </main>

      {/* Floating global Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default App;
