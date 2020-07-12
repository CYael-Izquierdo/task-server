const {validationResult} = require("express-validator");
const mongoose = require("mongoose");

const Task = require("../models/Task");
const Project = require("../models/Project");
const helper = require("./helper");

// Create a new task
exports.createTask = async (req, res) => {

    const {projectId} = req.body;

    try {
        const project = await helper.getProject(projectId);

        // Verify project
        if (!project) {
            return res.status(404).json({msg: "Project not found"})
        }

        // Verify project owner
        if (project.createdBy.toString() !== req.user.id) {
            return res.status(401).json({msg: "Not authorized"});
        }

        // Create task
        const task = new Task(req.body);
        await task.save();
        return res.json({task});
    } catch (e) {
        console.log(e);
        res.status(500).send("There was an unexpected error.");
    }

}

exports.getTasks = async (req, res) => {

    const {id} = req.params;

    try {
        const project = await helper.getProject(id);

        // Verify project
        if (!project) {
            return res.status(404).json({msg: "Project not found"})
        }

        // Get project tasks
        const tasks = await Task.find({projectId: id});

        return res.status(200).json({tasks});
    } catch (e) {
        console.log(e);
        res.status(500).send("There was an unexpected error.");
    }
}

exports.updateTask = async (req, res) => {

    const {name, complete} = req.body;
    const newTask = {};

    if (name) {
        newTask.name = name;
    }
    if (complete) {
        newTask.complete = complete;
    }
    if (Object.keys(newTask).length === 0) {
        return res.status(400).json({msg: "At least one attribute must be changed (name: string, complete: boolean"});
    }

    try {
        // Validate task exist
        let task = await helper.get(Task, req.params.id);

        // Verify project
        if (!task) {
            return res.status(404).json({msg: "Task not found"})
        }

        // Validate project
        let project = await helper.get(Project, task.projectId);

        // Verify project
        if (!project) {
            return res.status(404).json({msg: "Project not found"})
        }

        // Validate user
        // Verify createdBy
        if (project.createdBy.toString() !== req.user.id) {
            return res.status(401).json({msg: "Not authorized"});
        }

        task = await Task.findByIdAndUpdate(req.params.id, {$set: newTask}, {new: true});
        res.json({task});
    } catch (e) {
        console.log(e);
        res.status(500).send("There was an unexpected error.");
    }
}

exports.deleteTask = async (req, res) => {
    try {
        // Validate task exist
        let task = await helper.get(Task, req.params.id);

        // Verify project
        if (!task) {
            return res.status(404).json({msg: "Task not found"})
        }

        // Validate project
        let project = await helper.get(Project, task.projectId);

        // Verify project
        if (!project) {
            return res.status(404).json({msg: "Project not found"})
        }

        // Validate user
        // Verify createdBy
        if (project.createdBy.toString() !== req.user.id) {
            return res.status(401).json({msg: "Not authorized"});
        }

        await Task.findByIdAndDelete(req.params.id);
        res.json({msg: "Task successfully deleted"});
    } catch (e) {
        console.log(e);
        res.status(500).send("There was an unexpected error.");
    }
}
