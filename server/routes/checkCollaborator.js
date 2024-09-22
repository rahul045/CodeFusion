const express = require('express');
const router = express.Router();
const Project = require('../models/project'); // Assuming you have a Project model
const authMiddleware = require('./middleware');  // Middleware for authentication

// Check if user is a collaborator in the project
router.post('/isCollaborator', authMiddleware, async (req, res) => {
    const { projectId } = req.body;
    const userEmail = req.user.email;  // Email from authenticated user

    try {
        // Fetch the project by ID
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        // Check if the user is in the collaborators list
        const isCollaborator = project.collaborators.includes(userEmail);

        if (isCollaborator) {
            return res.status(200).json({ msg: 'User is a collaborator' });
        } else {
            return res.status(403).json({ msg: 'User is not a collaborator' });
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
