const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/project.js");

async function routes(fastify) {
  fastify.post("/", createProject);
  fastify.get("/", getAllProjects);
  fastify.get("/:id", getProjectById);
  fastify.put("/:id", updateProject);
  fastify.delete("/:id", deleteProject);
}

module.exports = routes;
