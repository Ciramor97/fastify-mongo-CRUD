const fastify = require("fastify")({ logger: true });
const mongoose = require("mongoose");
require("dotenv").config();

const { apiKeyAuth, basicAuth } = require("./middlewares/auth.js");

//import routes
const userRoutes = require("./routes/user.js");
const projectRoutes = require("./routes/project.js");

//connect to db
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to db"))
  .catch((err) => console.log("Error connecting to db", err));

//register routes
fastify.register(userRoutes, {
  prefix: "/api/v1/users",
});

fastify.register(projectRoutes, {
  prefix: "/api/v1/projects",
});

fastify.addHook("preHandler", basicAuth);
//start server
const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 5000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
