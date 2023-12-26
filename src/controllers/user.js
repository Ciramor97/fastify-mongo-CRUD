const User = require("../models/user.js");

async function getAllUsers(req, reply) {
  try {
    const users = await User.find();
    reply.code(200).send(users);
  } catch (error) {
    reply.code(500).send(error);
  }
}

async function getUserById(req, reply) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user)
      return reply
        .status(404)
        .send({ message: "User with this id doesn't exist" });
    reply.send(user);
  } catch (error) {
    reply.code(500).send(error);
  }
}

async function createUser(req, reply) {
  try {
    const user = await new User(req.body);
    const result = user.save();
    reply.send(result);
  } catch (error) {
    reply.code(500).send(error);
  }
}

async function updateUser(req, reply) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    reply.send(user);
  } catch (error) {
    reply.code(500).send(error);
  }
}

async function deleteUser(req, reply) {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    return reply
      .status(204)
      .send({ message: "User with id: " + id + " is deleted" });
  } catch (error) {
    reply.code(500).send(error);
  }
}

module.exports = {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
};
