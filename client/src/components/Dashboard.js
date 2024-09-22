import React, { useEffect, useState } from 'react';
import {
    Button,
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
import { FaEye, FaPlus, FaSignInAlt, FaTrash } from 'react-icons/fa'; // Removed FaStar
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
    const [projectList, setProjectList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleCreateModal = () => setCreateModal(!createModal);
    const toggleJoinModal = () => setJoinModal(!joinModal);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProject({ ...newProject, [name]: value });
    };

    const handleAddCollaborator = () => {
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
                setProjectList(data);
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
                navigate('/project', { state: { projectData: { projectId: projectID } } });
            } else {
                alert(data.msg || 'Failed to join the project. You may not be a collaborator.');
            }
        } catch (error) {
            console.error('Error joining project:', error);
            alert('Error joining the project. Please try again.');
        }
        toggleJoinModal();
    };

    const filteredProjects = projectList.filter((project) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleView = (projectId, code) => {
        navigate('/project', { state: { projectData: { projectId, projectCode: code } } });
    };

    return (
        <Container className='dashboard-container'>
            <h1 className='dashboard-title'>Welcome to CodeFusion</h1>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <Button color="success" onClick={toggleCreateModal}>
                    <FaPlus className="me-2" /> Create Project
                </Button>
                <Input
                    type="text"
                    placeholder="Search Projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <Button color="primary" onClick={toggleJoinModal}>
                    <FaSignInAlt className="me-2" /> Join Project
                </Button>
            </div>

            <h2 className='dashboard-subtitle'>My Past Projects</h2>

            <Row className="card-row">
                {filteredProjects.length > 0 ? (
                    filteredProjects.map((project, index) => (
                        <Col key={index} md="4" className="project-col">
                            <Card className="project-card shadow-sm">
                                <div className="card-header">
                                    <img
                                        alt="Project"
                                        src="https://picsum.photos/300/200"
                                        className="card-image"
                                    />
                                </div>
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
                                    <Button
                                        color="primary"
                                        onClick={() => handleView(project.projectId, project.code)}
                                    >
                                        <FaEye className="me-2" /> View More
                                    </Button>
                                </CardBody>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p>No projects found</p>
                )}
            </Row>

            <Modal isOpen={createModal} toggle={toggleCreateModal}>
                <ModalHeader toggle={toggleCreateModal}>Create New Project</ModalHeader>
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
                            <Label for="collaborators">Collaborators</Label>
                            <div className="d-flex">
                                <Input
                                    id="collaborators"
                                    placeholder="Enter collaborator email"
                                    type="email"
                                    value={collaboratorEmail}
                                    onChange={(e) => setCollaboratorEmail(e.target.value)}
                                />
                                <Button
                                    color="success"
                                    className="ms-2"
                                    onClick={handleAddCollaborator}
                                >
                                    Add
                                </Button>
                            </div>

                            {newProject.collaborators.length > 0 && (
                                <ListGroup className="mt-2">
                                    {newProject.collaborators.map((email) => (
                                        <ListGroupItem key={email} className="d-flex justify-content-between align-items-center">
                                            {email}
                                            <FaTrash className="text-danger" onClick={() => handleRemoveCollaborator(email)} />
                                        </ListGroupItem>
                                    ))}
                                </ListGroup>
                            )}
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleCreateSubmit}>
                        Create
                    </Button>{' '}
                    <Button color="secondary" onClick={toggleCreateModal}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={joinModal} toggle={toggleJoinModal}>
                <ModalHeader toggle={toggleJoinModal}>Join Project</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="projectId">Project ID</Label>
                            <Input
                                id="projectId"
                                name="projectId"
                                placeholder="Enter project ID"
                                type="text"
                                value={projectID}
                                onChange={(e) => setProjectID(e.target.value)}
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleJoinSubmit}>
                        Join
                    </Button>{' '}
                    <Button color="secondary" onClick={toggleJoinModal}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </Container>
    );
};

export default Dashboard;
