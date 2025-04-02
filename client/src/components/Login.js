import React, { useState, useActionState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = async (prevState, formData) => {
    const username = formData.get('username');
    const password = formData.get('password');
    
    if (username && password) {
      onLogin({ username });
      return true;
    }
    return false;
  };

  const [state, formAction, isPending] = useActionState(handleLogin, false);

  return (
    <div className="login-container">
      <form action={formAction} className="login-form">
        <h2>Welcome to MyBox</h2>
        <div className="form-group">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button" disabled={isPending}>
          {isPending ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login; 