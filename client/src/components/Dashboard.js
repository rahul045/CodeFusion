import React, { useEffect, useState } from 'react';
import {
    Card,
    CardBody,
    CardTitle,
    CardSubtitle,
    CardText,
    Container,
    Row,
    Col,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
    ListGroup,
    ListGroupItem,
} from 'reactstrap';
import { FaEye, FaPlus, FaSignInAlt, FaTrash } from 'react-icons/fa';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    const [createModal, setCreateModal] = useState(false);
    const [joinModal, setJoinModal] = useState(false);
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        collaborators: []
    });
    const [collaboratorEmail, setCollaboratorEmail] = useState('');
    const [projectID, setProjectID] = useState('');
    const [createdProjects, setCreatedProjects] = useState([]);
    const [collaboratorProjects, setCollaboratorProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleCreateModal = () => setCreateModal(!createModal);
    const toggleJoinModal = () => setJoinModal(!joinModal);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProject({ ...newProject, [name]: value });
    };

    const handleAddCollaborator = (event) => {
        event.preventDefault();
        if (collaboratorEmail && !newProject.collaborators.includes(collaboratorEmail)) {
            setNewProject({
                ...newProject,
                collaborators: [...newProject.collaborators, collaboratorEmail]
            });
            setCollaboratorEmail('');
        }
    };

    const handleRemoveCollaborator = (email) => {
        setNewProject({
            ...newProject,
            collaborators: newProject.collaborators.filter(c => c !== email)
        });
    };

    const handleCreateSubmit = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_HOST}/api/createProject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify(newProject),
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/project', { state: { projectData: data } });
            } else {
                console.log(data.msg || 'Project creation failed!');
            }
        } catch (err) {
            console.log(err);
        }
        toggleCreateModal();
    };

    const fetchUserProjects = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_HOST}/api/myProjects`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token'),
                },
            });

            const data = await response.json();

            if (response.ok) {
                setCreatedProjects(data.createdProjects || []);
                setCollaboratorProjects(data.collaborativeProjects || []);
            } else {
                console.error(data.msg || 'Failed to fetch projects');
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUserProjects();
    }, []);

    const handleJoinSubmit = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_HOST}/api/isCollaborator`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({ projectId: projectID }),
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/project', { state: { projectData: { pId: projectID, projectCode: "" } } });
            } else {
                alert(data.msg || 'Failed to join the project. You may not be a collaborator.');
            }
        } catch (error) {
            console.error('Error joining project:', error);
            alert('Error joining the project. Please try again.');
        }
        toggleJoinModal();
    };

    const filteredCreatedProjects = createdProjects.filter((project) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredCollaboratorProjects = collaboratorProjects.filter((project) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleView = (projectId, code) => {
        navigate('/project', { state: { projectData: { pId: projectId, projectCode: code } } });
    };

    return (
        <Container className='dashboard-container'>
            <h1 className='dashboard-title'>Welcome to CodeFusion</h1>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <button className="pbtn" onClick={toggleCreateModal}>
                    <FaPlus className="me-2" /> Create Project
                </button>
                <Input
                    type="text"
                    placeholder="Search Projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button className="pbtn" onClick={toggleJoinModal}>
                    <FaSignInAlt className="me-2" /> Join Project
                </button>
            </div>

            <h2 className='dashboard-subtitle'>My Created Projects</h2>

            <Row className="card-row">
                {filteredCreatedProjects.length > 0 ? (
                    filteredCreatedProjects.map((project, index) => (
                        <Col key={index} xs="12" sm="6" md="4" className="project-col">
                            <Card className="project-card shadow-sm" style={{ backgroundColor: '#f4f6f9', borderRadius: '10px' }}>
                                <CardBody>
                                    <CardTitle tag="h5" className="card-title">
                                        {project.title}
                                    </CardTitle>
                                    <CardSubtitle className="mb-2 text-muted" tag="h6">
                                        {project.description}
                                    </CardSubtitle>
                                    <CardText>
                                        Collaborators: {project.collaborators.join(', ')}
                                    </CardText>
                                    <button
                                        className='pbtn'
                                        onClick={() => handleView(project._id, project.code)}
                                    >
                                        <FaEye className="me-2" /> View More
                                    </button>
                                </CardBody>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p>No projects found</p>
                )}
            </Row>

            <h2 className='dashboard-subtitle'>Projects I'm Collaborating On</h2>

            <Row className="card-row">
                {filteredCollaboratorProjects.length > 0 ? (
                    filteredCollaboratorProjects.map((project, index) => (
                        <Col key={index} xs="12" sm="6" md="4" className="project-col">
                            <Card className="project-card shadow-sm" style={{ backgroundColor: '#f4f6f9', borderRadius: '10px' }}>
                                <CardBody>
                                    <CardTitle tag="h5" className="card-title">
                                        {project.title}
                                    </CardTitle>
                                    <CardSubtitle className="mb-2 text-muted" tag="h6">
                                        {project.description}
                                    </CardSubtitle>
                                    <CardText>
                                        Collaborators: {project.collaborators.join(', ')}
                                    </CardText>
                                    <button
                                        className='pbtn'
                                        onClick={() => handleView(project._id, project.code)}
                                    >
                                        <FaEye className="me-2" /> View More
                                    </button>
                                </CardBody>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p>No projects found</p>
                )}
            </Row>

            <Modal isOpen={createModal} toggle={toggleCreateModal} size="lg">
                <ModalHeader toggle={toggleCreateModal} style={{ color: "black" }}>Create New Project</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="projectTitle">Project Title</Label>
                            <Input
                                id="projectTitle"
                                name="title"
                                placeholder="Enter project title"
                                type="text"
                                value={newProject.title}
                                onChange={handleInputChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="projectDescription">Project Description</Label>
                            <Input
                                id="projectDescription"
                                name="description"
                                placeholder="Enter project description"
                                type="textarea"
                                value={newProject.description}
                                onChange={handleInputChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="collaboratorEmail">Add Collaborators</Label>
                            <Input
                                id="collaboratorEmail"
                                name="collaboratorEmail"
                                placeholder="Enter collaborator email"
                                type="email"
                                value={collaboratorEmail}
                                onChange={(e) => setCollaboratorEmail(e.target.value)}
                            />
                            <button className='pbtn' onClick={handleAddCollaborator}>
                                Add Collaborator
                            </button>
                        </FormGroup>

                        <ListGroup>
                            {newProject.collaborators.map((email, index) => (
                                <ListGroupItem key={index}>
                                    {email}
                                    <button type="button" className="sbtn" onClick={() => handleRemoveCollaborator(email)}>
                                        <FaTrash />
                                    </button>
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <button className='pbtn' onClick={handleCreateSubmit}>Create Project</button>{' '}
                    <button className='sbtn' onClick={toggleCreateModal}>Cancel</button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={joinModal} toggle={toggleJoinModal}>
                <ModalHeader toggle={toggleJoinModal} style={{ color: "black" }}>Join a Project</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="projectID">Project ID</Label>
                            <Input
                                id="projectID"
                                name="projectID"
                                placeholder="Enter project ID to join"
                                type="text"
                                value={projectID}
                                onChange={(e) => setProjectID(e.target.value)}
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <button className='pbtn' onClick={handleJoinSubmit}>Join Project</button>{' '}
                    <button className='sbtn' onClick={toggleJoinModal}>Cancel</button>
                </ModalFooter>
            </Modal>
        </Container>
    );
};

export default Dashboard;
