import React, { useState } from 'react';

// Component for Advertisement
function Advertisement({ onClick }) {
  return (
    <div className="advertisement" onClick={onClick}>
      {/* Replace the placeholder with your advertisement image */}
      <img src="advertisement.jpg" alt="Advertisement" />
    </div>
  );
}

// Component for Login Page
function LoginPage({ onClose }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Add your login logic here
    console.log("Logged in with", username, password);
    // For simplicity, I'm just closing the login page
    onClose();
  };

  return (
    <div className="login-page">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

// Main App Component
function App() {
  const [isLoginPageOpen, setIsLoginPageOpen] = useState(false);

  const handleAdvertisementClick = () => {
    setIsLoginPageOpen(true);
  };

  const handleCloseLoginPage = () => {
    setIsLoginPageOpen(false);
  };

  return (
    <div className="app">
      {/* Icon on top right */}
      <div className="icon" onClick={handleAdvertisementClick}>
        <img src="icon.png" alt="Icon" />
      </div>

      {/* Advertisement component */}
      <Advertisement onClick={handleAdvertisementClick} />

      {/* Login page */}
      {isLoginPageOpen && <LoginPage onClose={handleCloseLoginPage} />}
    </div>
  );
}

export default App;
