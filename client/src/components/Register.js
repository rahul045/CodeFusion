import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Register.css'
import log from './assets/login.png'
const Register = ({ switchToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            // console.log(process.env);

            const response = await fetch(`${process.env.REACT_APP_HOST}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Save token to local storage (or handle it however you want)
                localStorage.setItem('token', data.token);
                console.log('Registration successful!', data);
                navigate('/login');
                switchToLogin();
            } else {
                setError(data.msg || 'Registration failed!');
            }
        } catch (err) {
            setError('Server error');
        }
    };

    return (
        <div>
            <h1  >CodeFusion</h1>
            <div className='log'>
                <img src={log} alt="login" height="700px" width="900px" />
            </div>

            <Container className="cont">
                <h2 className="my-4">Register</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="registerName">
                        {/* <Form.Label>Full Name</Form.Label> */}
                        <input className="inputs"
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="registerEmail" className="mt-3">
                        {/* <Form.Label>Email address</Form.Label> */}
                        <input className="inputs"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="registerPassword" className="mt-3">
                        {/* <Form.Label>Password</Form.Label> */}
                        <input className="inputs"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="registerConfirmPassword" className="mt-3">
                        {/* <Form.Label>Confirm Password</Form.Label> */}
                        <input className="inputs"
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <button className="btn" type="submit" >
                        Register
                    </button>
                </Form>

                <p className="txt">
                    Already have an account?{' '}
                    <span className="sp" onClick={switchToLogin}>
                        Login here
                    </span>
                </p>
            </Container>
        </div>
    );
};

export default Register;
