const Project = require("../models/Project");
const {validationResult} = require("express-validator");
const mongoose = require("mongoose");

// Create new project
exports.createProject = async (req, res) => {
    // Validate errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        // Create project
        const project = new Project(req.body);
        // Save creator
        project.createdBy = req.user.id;

        // Save project
        await project.save();
        res.status(201).json(project);
    } catch (e) {
        console.log(e);
        res.status(500).send("There was an unexpected error.");
    }
}

// Get user projects
exports.getUserProjects = async (req, res) => {

    try {
        const projects = await Project.find({createdBy: req.user.id}).sort({createdAt: -1});

        res.json({projects});
    } catch (e) {
        console.log(e);
        res.status(500).send("There was an unexpected error.");
    }
}

// Update project
exports.updateProject = async (req, res) => {
    // Validate errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    // Get project information
    const {name} = req.body;
    const newProject = {};

    if (name) {
        newProject.name = name;
    }

    try {
        // Verify ID
        let project;

        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            await Project.findById(req.params.id, (err, result) => {
                // user is a single document which may be null for no results
                if (err || !result) {
                    // there is an error or no a project
                    project = null;
                } else {
                    // there is project
                    project = result;
                }
            });
        } else {
            project = null;
        }

        // Verify project
        if (!project) {
            return res.status(404).json({msg: "Project not found"})
        }

        // Verify createdBy
        if (project.createdBy.toString() !== req.user.id) {
            return res.status(401).json({msg: "Not authorized"});
        }

        // Update
        project = await Project.findByIdAndUpdate({_id: req.params.id}, {$set: newProject}, {new: true});

        res.json({project});
    } catch (e) {
        console.log(e);
        res.status(500).send("There was an unexpected error.");
    }
}

// Update project
exports.deleteProject = async (req, res) => {
    try {
        // Verify ID
        let project;

        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            await Project.findById(req.params.id, (err, result) => {
                // user is a single document which may be null for no results
                if (err || !result) {
                    // there is an error or no a project
                    project = null;
                } else {
                    // there is project
                    project = result;
                }
            });
        } else {
            project = null;
        }

        // Verify project
        if (!project) {
            return res.status(404).json({msg: "Project not found"})
        }

        // Verify createdBy
        if (project.createdBy.toString() !== req.user.id) {
            return res.status(401).json({msg: "Not authorized"});
        }

        // Update
        project = await Project.findByIdAndDelete(req.params.id);

        res.json({msg: "Project successfully deleted", project});
    } catch (e) {
        console.log(e);
        res.status(500).send("There was an unexpected error.");
    }
}