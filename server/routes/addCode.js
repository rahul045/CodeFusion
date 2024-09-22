const express = require('express');
const router = express.Router();
const authMiddleware = require('./middleware'); // Assuming you're using an auth middleware
const Project = require('../models/project'); // Import your Project model

// API to update a project with code
router.post('/addCodeToProject', authMiddleware, async (req, res) => {
    const { projectId, code } = req.body;

    try {
        // Find the project by its ID
        const project = await Project.findById(projectId);

        // Check if the project exists
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        // Add the code to the project (assuming you're adding a new field 'code')
        project.code = code;

        // Save the updated project
        await project.save();

        // Return the updated project or a success message
        res.status(200).json({ msg: 'Code added to project successfully', project });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
