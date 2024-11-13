import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import log from './assets/login.png'
import prof from './assets/profile.png'
const Login = ({ switchToRegister, onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("fd");
        console.log(process.env.REACT_APP_HOST)
        try {
            const response = await fetch(`${process.env.REACT_APP_HOST}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Save token to local storage (or handle it however you want)
                localStorage.setItem('token', data.token);
                console.log('Login successful!', data);
                onLogin();
                navigate('/dashboard');

            } else {
                setError(data.msg || 'Login failed!');
            }
        } catch (err) {
            setError('Server error');
        }
    };

    return (
        <div>
            {/* <h1  >CodeFusion</h1> */}
            <div className='log'>
                <img src={log} alt="login" height="700px" width="900px" />
            </div>

            <Container className='contain'>
                <div className='pro'>
                    <img src={prof} alt="login" height="200px" width="200px" />
                </div>
                <h2 className="my-4">Login</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <Form.Group controlId="loginEmail">
                        {/* <Form.Label>Email address</Form.Label> */}
                        <input
                            className="inputs"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="loginPassword" className="mt-3">
                        {/* <Form.Label>Password</Form.Label> */}
                        <input
                            className="inputs"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <button type="submit" className="btn">
                        Login
                    </button>
                </form>

                <p className="mt-3 txt">
                    Don't have an account?{' '}
                    <span className="sp" onClick={switchToRegister}>
                        Register here
                    </span>
                </p>
            </Container>
        </div>
    );
};

export default Login;
