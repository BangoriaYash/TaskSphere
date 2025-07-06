const Project = require('../models/project.model');
const User = require('../models/user.model');
const Task = require('../models/task.model');
const mongoose = require('mongoose');

exports.createTask = async (req, res) => {
  try {
    console.log(req.body);
    const { title, description, startDate, endDate, project } = req.body;
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
    }
    const userId = req.userId; 
    if (!project) {
      return res.status(400).json({ error: 'Project ID is required' });
    }
    
    // if (!mongoose.Types.ObjectId.isValid(project)) {
    //   return res.status(400).json({ error: 'Invalid Project ID' });
    // }
    const task = new Task({
      title,
      description,
      startDate,
      endDate,
      project,
      createdBy: userId 
    });

    await task.save();
    
    res.status(201).json({ message: 'Task created', task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({
      createdBy: req.userId,
      project: projectId
    }).populate('project');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAllEmployees = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: 'Invalid Project ID' });
    }

    // FIXED populate here
    const project = await Project.findById(projectId).populate({
      path: 'members.user',
      select: 'username email role'
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Filter users where role is 'employee'
    const employees = project.members
      .filter(member => member.user && member.role === 'employee') //  Check member.role
      .map(member => ({
        _id: member.user._id,
        username: member.user.username,
        email: member.user.email
      }));

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.userId;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Optional: Check if user is assigned to the task
    const isAssigned = task.assignedTo.some(id => id.toString() === userId);
    if (!isAssigned) {
      return res.status(403).json({ error: 'Not authorized to update this task' });
    }

    // Toggle status logic
    if (task.status === 'to-do') {
      task.status = 'in-progress';
    } else if (task.status === 'in-progress') {
      task.status = 'completed';
    }

    await task.save();
    res.status(200).json({ message: 'Task status updated', task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.assignTaskToEmployee = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { employeeId } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Push the employee to assignedTo array
    task.assignedTo.push(employeeId);
    await task.save();

    res.status(200).json({ message: 'Task assigned successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, startDate, endDate } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.title = title;
    task.description = description;
    task.startDate = startDate;
    task.endDate = endDate;

    await task.save();
    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
