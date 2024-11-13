const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const authMiddleware = require('./middleware');
// API to get code by project ID
router.get('/fetchCode/:projectId', authMiddleware, async (req, res) => {
    const { projectId } = req.params;
    try {
        const project = await Project.findOne({ _id: projectId }); // Find project by ID
        if (project) {
            res.json({ code: project.code });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        console.error('Error fetching project code:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
