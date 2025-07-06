const Project = require('../models/project.model');

async function updateProjectStatuses() {
  try {
    const now = new Date();
    const projects = await Project.find({}); // Fetch all projects

    for (const project of projects) {
      const adjustedEndDate = new Date(project.endDate);
      adjustedEndDate.setHours(23, 59, 59, 999); // End of the endDate

      if (now > adjustedEndDate) {
        if (project.status !== 'expired') {
          project.status = 'expired';
          await project.save();
          console.log(` Project "${project.name}" marked as expired.`);
        }
      } else {
        if (project.status !== 'ongoing') {
          project.status = 'ongoing';
          await project.save();
          console.log(` Project "${project.name}" marked as ongoing.`);
        }
      }
    }

    console.log(` Project statuses updated at ${new Date().toISOString()}`);
  } catch (error) {
    console.error(' Error updating project statuses:', error);
  }
}

module.exports = { updateProjectStatuses };
