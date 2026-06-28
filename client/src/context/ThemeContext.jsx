import React, { createContext, useState, useEffect, useContext } from 'react';

// Create Theme Context Object
const ThemeContext = createContext();

/**
 * Provider component that wraps our app and distributes theme state.
 */
export const ThemeProvider = ({ children }) => {
  // Initialize state by checking localStorage first.
  // This ensures that if a user sets Dark Mode, it persists when they reload.
  // Defaults to 'light' if no preference is stored.
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'light';
  });

  // useEffect triggers every time the 'theme' state changes.
  useEffect(() => {
    // 1. Update the custom 'data-theme' attribute on the HTML root element
    // This triggers our CSS [data-theme='dark'] styling overrides
    document.documentElement.setAttribute('data-theme', theme);
    
    // 2. Persist the theme choice in local storage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Toggle helper function
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom React Hook to consume the Theme Context.
 * Using a custom hook reduces boilerplates in child components.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
