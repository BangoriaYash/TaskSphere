const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/createTask', authMiddleware(),taskController.createTask);
// Get all tasks created by current user
router.get('/my-tasks/:projectId', authMiddleware(),taskController.getMyTasks);

// Get all employees
// Assuming you're using Express and the `projectId` is passed as a URL parameter
router.get('/:projectId/employees',authMiddleware() ,taskController.getAllEmployees);


// Assign task to employee
router.put('/assign-task/:taskId', authMiddleware(), taskController.assignTaskToEmployee);
router.patch('/update-status/:taskId', authMiddleware(), taskController.updateTaskStatus);
router.put('/tasks/:taskId', authMiddleware(), taskController.updateTask);
module.exports = router;