const Project = require('../models/project.model');
const User = require('../models/user.model');
const Task = require('../models/task.model');
const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;

exports.createProject = async (req, res) => {
  try {
    const { name, description, startDate, endDate } = req.body;
    const userId = req.session.userId; // assume this comes from auth middleware

    // Create a new project instance with the provided details
    const project = new Project({
      name,
      description,  // Added description
      startDate,    // Added startDate
      endDate,      // Added endDate
      createdBy: userId,
      members: [{ user: userId, role: 'admin' }]
    });

    // Save the project to the database
    await project.save();
    
    // Respond with a success message and the created project
    res.status(201).json({ message: 'Project created', project });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ error: error.message });
  }
};
// Get projects created by the logged-in user
exports.getUserProjects = async (req, res) => {
  try {
    const userId = req.session.userId; // From session
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const projects = await Project.find({ createdBy: userId });
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email role'); // fetch limited fields
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.assignRole = async (req, res) => {
  try {
    const { projectId, userId, role } = req.body;
    const currentUserId = req.session.userId;
    const project = await Project.findById(projectId);
    if (!currentUserId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // if (userId === currentUserId.toString() && project.createdBy.toString() === currentUserId.toString()) {
    //   return res.status(400).json({ message: "You can't assign a role to yourself." });
    // }
    // Ensure m.user exists before calling .toString()
    const memberIndex = project.members.findIndex(
      m => m.user && m.user.toString() === userId
    );

    if (memberIndex >= 0) {
      project.members[memberIndex].role = role;
    } else {
      project.members.push({ user: userId, role });
    }

    await project.save();
    res.json({ message: 'Role updated', project });
  } catch (error) {
    console.error("Assign Role Error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getUserRelatedProjects = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const projects = await Project.find({
      $or: [
        { createdBy: userId},
        { 'members.user': userId }
      ]
    }).populate('createdBy', 'name')
      .populate('members.user', 'name email');
      // console.log(JSON.stringify(projects, null, 2));

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching user-related projects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { projectId, name, description, startDate, endDate } = req.body;
    const userId = req.session.userId;

    const project = await Project.findById(projectId);

    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized to update this project' });
    }

    // Update project fields
    project.name = name || project.name;
    project.description = description || project.description;
    project.startDate = startDate || project.startDate;
    project.endDate = endDate || project.endDate;

    await project.save();
    res.json({ message: 'Project updated successfully', project });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: error.message });
  }
};
// DELETE a project
exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.session.userId;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this project' });
    }

    await Project.findByIdAndDelete(projectId);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.session.userId;

    const project = await Project.findOne({
      _id: projectId,
      $or: [
        { createdBy: userId },
        { 'members.user': userId }
      ]
    });

    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getTaskByProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    const tasks = await Task.find({ project: new ObjectId(projectId) })
      .populate('assignedTo', '_id username');
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
