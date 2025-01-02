import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch(`/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            const { token, user } = data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user)); // Store the whole user object

            setSuccessMessage(data.message);
            setErrorMessage(''); // Clear any previous error messages
            
            console.log('Navigating to /home');
            navigate('/home', { state: { user }}); 
          } else {
            // Handle server errors
            setErrorMessage(data.error || 'Login failed. Please try again.');
          }
    } catch (error) {
        setErrorMessage('Network error. Please check your connection and try again.');
        console.error('Login error:', error);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Box width="300px" padding="20px" boxShadow={3} borderRadius={2}>
        <Typography variant="h5" textAlign="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Email/Username"
            type="text"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '20px' }}>
            Login
          </Button>
        </form>
        {successMessage && <Typography color="primary">{successMessage}</Typography>}
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      </Box>
    </Box>
  );
};

export default Login;
