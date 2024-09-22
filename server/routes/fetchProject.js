const express = require('express');
const router = express.Router();
const Project = require('../models/project'); // Assuming Project model is already defined
const authMiddleware = require('./middleware'); // Authentication middleware

// Route to fetch projects created by the logged-in user
router.get('/myProjects', authMiddleware, async (req, res) => {
    try {
        // Fetch projects where the 'createdBy' field matches the email of the logged-in user
        const projects = await Project.find({ createdBy: req.user.email });

        if (projects.length === 0) {
            return res.status(404).json({ msg: 'No projects found for this user.' });
        }

        // Return the found projects to the client
        res.status(200).json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
