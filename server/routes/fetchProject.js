const express = require('express');
const router = express.Router();
const Project = require('../models/project'); // Assuming Project model is already defined
const authMiddleware = require('./middleware'); // Authentication middleware

// Route to fetch projects created by the user and projects where the user is a collaborator
router.get('/myProjects', authMiddleware, async (req, res) => {
    try {
        const userEmail = req.user.email;

        // Find projects created by the user
        const createdProjects = await Project.find({ createdBy: userEmail });

        // Find projects where the user is a collaborator but not the creator
        const collaborativeProjects = await Project.find({
            collaborators: userEmail
        });

        if (createdProjects.length === 0 && collaborativeProjects.length === 0) {
            return res.status(404).json({ msg: 'No projects found for this user.' });
        }

        // Return both lists in the response
        res.status(200).json({
            createdProjects,
            collaborativeProjects
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
