const mongoose = require("mongoose");

const Project = require("../models/Project");
const Task = require("../models/Task");

exports.getProject = async projectId => {
    let project;

    if (mongoose.Types.ObjectId.isValid(projectId)) {
        await Project.findById(projectId, (err, result) => {
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
    return project;
}

exports.getTask = async id => {
    let task;

    if (mongoose.Types.ObjectId.isValid(id)) {
        await Task.findById(id, (err, result) => {
            // user is a single document which may be null for no results
            if (err || !result) {
                // there is an error or no a project
                task = null;
            } else {
                // there is project
                task = result;
            }
        });
    } else {
        task = null;
    }
    return task;
}

exports.get = async (model, id) => {
    let task;

    if (mongoose.Types.ObjectId.isValid(id)) {
        await model.findById(id, (err, result) => {
            // user is a single document which may be null for no results
            if (err || !result) {
                // there is an error or no a project
                task = null;
            } else {
                // there is project
                task = result;
            }
        });
    } else {
        task = null;
    }
    return task;
}
