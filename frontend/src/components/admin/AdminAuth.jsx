import React, { useState, useContext, createContext } from 'react';
import './AdminAuth.css';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('adminAuthenticated') === 'true';
  });

  const adminLogin = (username, password) => {
    // Simple admin credentials (in production, this should be handled by backend)
    console.log('AdminLogin called with:', { username: `"${username}"`, password: `"${password}"` });
    console.log('Expected:', { username: '"admin"', password: '"admin123"' });
    
    const trimmedUsername = username.trim().toLowerCase();
    const trimmedPassword = password.trim();
    
    console.log('After trimming:', { username: `"${trimmedUsername}"`, password: `"${trimmedPassword}"` });
    
    if (trimmedUsername === 'admin' && trimmedPassword === 'admin123') {
      setIsAdminAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      console.log('Login successful!');
      return true;
    }
    console.log('Login failed - credentials do not match');
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
  };

  return (
    <AdminAuthContext.Provider value={{
      isAdminAuthenticated,
      adminLogin,
      adminLogout
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export default function AdminAuth({ children }) {
  const { isAdminAuthenticated, adminLogin } = useAdminAuth();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('Login attempt:', credentials); // Debug log

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const success = adminLogin(credentials.username, credentials.password);
    
    console.log('Login result:', success); // Debug log
    
    if (!success) {
      setError('Invalid username or password');
    }
    
    setIsLoading(false);
  };

  if (isAdminAuthenticated) {
    return children;
  }

  return (
    <div className="admin-auth-container">
      <div className="admin-auth-card">
        <div className="auth-header">
          <h2>Admin Login</h2>
          <p>Access the admin dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <div className="input-wrapper">
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                placeholder="Enter admin username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="Enter admin password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p><strong>Demo Credentials:</strong></p>
          <p>Username: admin</p>
          <p>Password: admin123</p>
          <div className="demo-buttons">
            <button 
              type="button" 
              className="demo-fill-btn"
              onClick={() => {
                setCredentials({ username: 'admin', password: 'admin123' });
                setError(''); // Clear any existing errors
              }}
            >
              Fill Demo Credentials
            </button>
            <button 
              type="button" 
              className="demo-login-btn"
              onClick={async () => {
                setIsLoading(true);
                setError('');
                await new Promise(resolve => setTimeout(resolve, 500)); // Quick loading
                const success = adminLogin('admin', 'admin123');
                if (!success) {
                  setError('Demo login failed');
                }
                setIsLoading(false);
              }}
            >
              Quick Demo Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
