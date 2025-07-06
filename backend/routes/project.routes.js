const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');

// Add authentication middleware if available
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/create', authMiddleware(),projectController.createProject);
router.get('/users', authMiddleware(), projectController.getAllUsers);
router.put('/assign-role',authMiddleware(), projectController.assignRole);
router.get('/my',authMiddleware(), projectController.getUserProjects);
router.get('/user-related-projects', authMiddleware(), projectController.getUserRelatedProjects);
router.put('/update/:projectId', authMiddleware(), projectController.updateProject);
router.delete('/delete/:projectId',authMiddleware(), projectController.deleteProject);
router.get('/project/:projectId',authMiddleware(), projectController.getProjectById);
router.get('/getTaskByProject/:projectId',authMiddleware(),projectController.getTaskByProject);

module.exports = router;
