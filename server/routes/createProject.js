const express = require('express');
const router = express.Router();
const Project = require('../models/project'); // Import the Project model
const authMiddleware = require('./auth');
// Route to create a new project
router.post('/createProject', authMiddleware, async (req, res) => {
    const { title, description, collaborators } = req.body;

    try {
        // Create a new project document
        const newProject = new Project({
            title,
            description,
            collaborators,
        });

        // Save the project to MongoDB
        const savedProject = await newProject.save();

        // Return the projectId to the client
        res.status(201).json({ projectId: savedProject._id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create project' });
    }
});

module.exports = router;
