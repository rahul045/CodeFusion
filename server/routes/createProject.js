const express = require('express');
const router = express.Router();
const authMiddleware = require('./middleware'); // Import middleware
const Project = require('../models/project');

router.post('/createProject', authMiddleware, async (req, res) => {
    const { title, description, collaborators } = req.body;

    try {
        // Validate request body
        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' });
        }

        const userEmail = req.user.email;
        // console.log('User Email:', userEmail); // Check if user email is present

        const newProject = new Project({
            title,
            description,
            collaborators,
            createdBy: userEmail,
        });

        // console.log('Creating new project:', newProject); // Log the project data for debugging

        // Save project to the database
        const savedProject = await newProject.save();
        res.status(201).json({ projectId: savedProject._id });

    } catch (error) {
        console.error('Error during project creation:', error.message); // Log detailed error message
        res.status(500).json({ error: 'Failed to create project', message: error.message }); // Include error message in response
    }
});

module.exports = router;
