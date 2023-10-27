// App.js
import React, { useState } from 'react';

function Login() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [file, setFile] = useState(null);

  const register = async () => {
    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.status === 201) {
        console.log('Registration successful');
      } else {
        console.log('Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const login = async () => {
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 200) {
        const data = await response.json();
        setToken(data.token);
      } else {
        console.log('Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const uploadFile = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        headers: {
          Authorization: token, // Send JWT token in the header
        },
        body: formData,
      });

      if (response.status === 200) {
        console.log('File uploaded successfully');
      } else {
        console.log('File upload failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>User Registration</h1>
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={register}>Register</button>

      <h1>User Login</h1>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={login}>Login</button>

      {token && (
        <div>
          <h1>File Upload</h1>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button onClick={uploadFile}>Upload File</button>
        </div>
      )}
    </div>
  );
}

export default Login;
