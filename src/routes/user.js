const { basicAuth, apiKeyAuth } = require("../middlewares/auth");

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");

const User = {
  type: "object",
  properties: {
    id: { type: "string" },
    firstName: { type: "string" },
    lastName: { type: "string" },
    email: { type: "string" },
    role: { type: "string" },
  },
};

const postUserOpts = {
  schema: {
    body: {
      type: "object",
      required: ["firstName", "lastName", "email", "password", "role"],
      properties: {
        firstName: { type: "string" },
        lastName: { type: "string" },
        email: { type: "string" },
        password: { type: "string" },
        role: { type: "string" },
      },
    },
    response: {
      201: User,
    },
  },
};

const updateUserOpts = {
  schema: {
    body: {
      type: "object",
      required: ["email"],
      properties: {
        email: { type: "string" },
      },
    },
    response: {
      201: User,
    },
  },
};

const getUsersOpts = {
  schema: {
    response: {
      200: {
        type: "array",
        user: User,
      },
    },
  },
};

const getUserOpts = {
  schema: {
    response: {
      200: User,
    },
  },
};

const deleteUserOpts = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
};
async function routes(fastify) {
  fastify.get("/", getUsersOpts, getAllUsers);
  fastify.get("/:id", getUserOpts, getUserById);
  fastify.post("/", postUserOpts, createUser); //protect an individual route
  // fastify.post("/", { preHandler: apiKeyAuth }, createUser); //protect an individual route
  fastify.put("/:id", updateUserOpts, updateUser);
  fastify.delete("/:id", deleteUserOpts, deleteUser);
}

module.exports = routes;
