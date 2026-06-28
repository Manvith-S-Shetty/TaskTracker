import React, { useEffect } from 'react';

/**
 * Reusable alert notification banner that slides from the bottom and fades out.
 * 
 * @param {string} message - Text content to display.
 * @param {string} type - Severity style: 'success' | 'error' | 'info'.
 * @param {function} onClose - Parent handler to clear toast state.
 * @param {number} duration - Time in milliseconds before auto-destruct (defaults to 3500ms).
 */
const Toast = ({ message, type = 'success', onClose, duration = 3500 }) => {
  
  // Set up an automatic timer to dismiss the notification
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    // Clean up function: clears the timeout if the component is unmounted
    // (e.g., if the user manually clicks 'close' before the timer finishes)
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  // Determine indicator color based on type
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          borderLeft: '5px solid var(--success)',
          iconColor: 'var(--success)',
          iconText: '✓',
        };
      case 'error':
        return {
          borderLeft: '5px solid var(--danger)',
          iconColor: 'var(--danger)',
          iconText: '✕',
        };
      case 'info':
      default:
        return {
          borderLeft: '5px solid var(--info)',
          iconColor: 'var(--info)',
          iconText: 'ℹ',
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div
      className="glass-panel"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 20px',
        minWidth: '300px',
        maxWidth: '90%',
        borderLeft: styles.borderLeft,
        borderRadius: 'var(--radius-md)',
        animation: 'toastSlide 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      }}
    >
      {/* Dynamic Alert Icon */}
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-primary)',
          color: styles.iconColor,
          fontWeight: 'bold',
          fontSize: '0.85rem',
        }}
      >
        {styles.iconText}
      </span>

      {/* Message Text */}
      <p
        style={{
          margin: 0,
          fontSize: '0.9rem',
          fontWeight: 500,
          color: 'var(--text-primary)',
          flex: 1,
        }}
      >
        {message}
      </p>

      {/* Manual Dismiss Button */}
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '1.2rem',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          padding: '0 4px',
          display: 'flex',
          alignItems: 'center',
        }}
        aria-label="Close notification"
      >
        &times;
      </button>
    </div>
  );
};

export default Toast;
