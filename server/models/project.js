const mongoose = require('mongoose');

// Define Project Schema
const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    code: { type: String, default: '' },
    collaborators: [String], // Array of user IDs or emails
    createdAt: { type: Date, default: Date.now },
});

// Create the model from the schema
const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
