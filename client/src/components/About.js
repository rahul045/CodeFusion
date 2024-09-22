import React from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button } from 'reactstrap';
import './About.css';

const About = () => {
    return (
        <Container className="about-container">
            <h1 className="about-title">About CodeFusion</h1>
            <p className="about-description">
                CodeFusion is a collaborative coding platform designed for developers to work together in real-time. Whether you're a beginner or an experienced coder, CodeFusion provides the tools you need to enhance your coding skills and collaborate effectively.
            </p>

            <Row className="card-row">
                <Col md="4" className="fade-in">
                    <Card className="about-card shadow">
                        <CardBody>
                            <CardTitle tag="h5" className="card-title">Real-Time Collaboration</CardTitle>
                            <CardText className="card-text">
                                Collaborate seamlessly with your team in real-time. CodeFusion allows multiple users to edit code simultaneously, making teamwork efficient and fun.
                            </CardText>
                            <Button color="primary" className="learn-more-btn">Learn More</Button>
                        </CardBody>
                    </Card>
                </Col>
                <Col md="4" className="fade-in">
                    <Card className="about-card shadow">
                        <CardBody>
                            <CardTitle tag="h5" className="card-title">Live Code Compilation</CardTitle>
                            <CardText className="card-text">
                                Instantly compile your code live and see the results in real-time as you and your collaborators make changes.
                            </CardText>
                            <Button color="primary" className="learn-more-btn">Learn More</Button>
                        </CardBody>
                    </Card>
                </Col>
                <Col md="4" className="fade-in">
                    <Card className="about-card shadow">
                        <CardBody>
                            <CardTitle tag="h5" className="card-title">User-Friendly Interface</CardTitle>
                            <CardText className="card-text">
                                Enjoy a clean and intuitive interface designed for developers of all levels. No matter your experience, CodeFusion is easy to navigate.
                            </CardText>
                            <Button color="primary" className="learn-more-btn">Learn More</Button>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default About;
