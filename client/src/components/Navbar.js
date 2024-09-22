import React from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink, Button } from 'reactstrap';
import { useNavigate, Link } from 'react-router-dom';
import './Navbar.css';

const MyNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login'); // Redirect to login page
    };

    return (
        <Navbar color="light" light expand="md" className="mb-4">
            <NavbarBrand tag={Link} to="/dashboard">CodeFusion</NavbarBrand>
            <Nav className="ml-auto" navbar>
                <NavItem>
                    <NavLink tag={Link} to="/dashboard">Dashboard</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} to="/about">About</NavLink>
                </NavItem>
                <NavItem>
                    <Button color="danger" onClick={handleLogout}>
                        Logout
                    </Button>
                </NavItem>
            </Nav>
        </Navbar>
    );
};

export default MyNavbar;
