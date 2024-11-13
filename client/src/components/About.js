import React from 'react';
import { Container, Row, Col, Card, CardImg, CardBody, CardTitle, CardText, Button } from 'reactstrap';
import './About.css';
import colab from './assets/colab.jpeg'
import compile from './assets/compile.webp'
import user from './assets/user.avif'
const About = () => {
    return (
        <div className="about-container">
            <h1 className="about-title">About CodeFusion</h1>
            <p className="about-description">
                CodeFusion is an innovative, real-time collaborative coding platform tailored for developers at all skill levels to connect, create, and grow together. Designed with features to support both novice coders and experienced professionals, CodeFusion provides an immersive environment that simplifies pair programming and teamwork. With its powerful live code editor, users can code simultaneously, view changes in real-time, and see instant feedback on their work.

                The platform integrates the Monaco Editor, ensuring a rich coding experience with syntax highlighting and autocompletion, while the Judge0 API facilitates live code compilation across multiple programming languages. Developers can start a project by generating a unique project ID, share it with teammates, and dive into a seamless coding session.             </p>

            <Row className="card-row">
                <Col md="4" className="fade-in">
                    <Card className="about-card shadow">
                        <CardBody>
                            <CardImg
                                top
                                src={colab}
                                alt="Collaboration"
                                className="card-image"
                            />
                            <CardTitle tag="h5" className="card-title">Real-Time Collaboration</CardTitle>
                            <CardText className="card-text">
                                Collaborate seamlessly with your team in real-time. CodeFusion allows multiple users to edit code simultaneously, making teamwork efficient and fun.
                            </CardText>
                            {/* <button color="primary" className="learn-more-btn">Learn More</button> */}
                        </CardBody>
                    </Card>
                </Col>
                <Col md="4" className="fade-in">
                    <Card className="about-card shadow">
                        <CardBody>
                            <CardImg
                                top
                                src={compile}
                                alt="Live Compilation"
                                className="card-image"
                            />
                            <CardTitle tag="h5" className="card-title">Live Code Compilation</CardTitle>
                            <CardText className="card-text">
                                Instantly compile your code live and see the results in real-time as you and your collaborators make changes.
                            </CardText>
                            {/* <button color="primary" className="learn-more-btn">Learn More</button> */}
                        </CardBody>
                    </Card>
                </Col>
                <Col md="4" className="fade-in">
                    <Card className="about-card shadow">
                        <CardBody>
                            <CardImg
                                top
                                src={user}
                                alt="User Friendly Interface"
                                className="card-image"
                            />s
                            <CardTitle tag="h5" className="card-title">User-Friendly Interface</CardTitle>
                            <CardText className="card-text">
                                Enjoy a clean and intuitive interface designed for developers of all levels. No matter your experience, CodeFusion is easy to navigate.
                            </CardText>
                            {/* <button color="primary" className="learn-more-btn">Learn More</button> */}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default About;
