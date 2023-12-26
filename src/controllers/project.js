const Project = require("../models/project.js");
const User = require("../models/user.js");

async function createProject(req, reply) {
  try {
    // confirm that the project manager id exist and is valid
    const projectManager = await User.findById(req.body.projectManager);
    if (
      !projectManager ||
      !["Admin", "Project Manager"].includes(projectManager.role)
    )
      return reply
        .status(400)
        .send({ message: "Project Manager doesn't exist" });

    // verify that team members exist

    for (let memberId of req.body.teamMembers) {
      const teamMember = await User.findById(memberId);
      if (!teamMember)
        return reply
          .status(400)
          .send({ message: "Invalid team members: " + memberId });
    }
    // req.body.teamMembers.array.forEach((element) => {});
    // create my project

    let project = new Project(req.body);
    project = await project.save();

    if (!project) res.status(500).send("The project can't be created");
    reply.send(project);
  } catch (error) {
    reply.code(500).send(error);
  }
}

async function getAllProjects(req, reply) {
  try {
    const projects = await Project.find()
      .populate("projectManager", "firstName lastName email")
      .populate("teamMembers", "firstName lastName email role");
    reply.code(200).send(projects);
  } catch (error) {
    reply.code(400).send(error);
  }
}

async function getProjectById(req, reply) {
  try {
    const { id } = req.params;
    const project = await Project.findById(id)
      .populate("projectManager", "firstName lastName email")
      .populate("teamMembers", "firstName lastName email role");
    if (!project)
      reply
        .status(404)
        .send({ message: "Project with id " + id + " not found" });
    reply.send(project);
  } catch (error) {
    reply.code(500).send(error);
  }
}

async function updateProject(req, reply) {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.projectManager) {
      const projectManager = await User.findById(updates.projectManager);
      if (
        !projectManager ||
        !["Admin", "Project Manager"].includes(projectManager.role)
      )
        return reply
          .status(400)
          .send({ message: "Project Manager doesn't exist" });
    }

    // verify that team members exist
    if (updates.teamMembers) {
      for (let memberId of updates.teamMembers) {
        const teamMember = await User.findById(memberId);
        if (!teamMember)
          return reply
            .status(400)
            .send({ message: "Invalid team members: " + memberId });
      }
    }
    const updatedProject = await User.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedProject)
      return reply
        .status(404)
        .send({ message: "No project with " + id + " found" });
    reply.send(updatedProject);
  } catch (error) {
    reply.code(500).send(error);
  }
}

async function deleteProject(req, reply) {
  const { id } = req.params;
  try {
    const deletedPrjoject = await Project.findByIdAndDelete(id);
    if (!deletedPrjoject)
      return reply
        .status(404)
        .send({ message: "project with this id doesn't exist" });
    reply.status(204).send("");
  } catch (error) {
    reply.code(400).send(error);
  }
}

module.exports = {
  createProject,
  getProjectById,
  getAllProjects,
  updateProject,
  deleteProject,
};
