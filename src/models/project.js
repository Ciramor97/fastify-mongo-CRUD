const mongoose = require("mongoose");
const User = require("../models/user");

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  projectManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: async (v) => {
        const user = await User.findById(v);
        return ["Project Manager", "Admin"].includes(user.role);
      },
      message: (props) => "User role must be Project Manager or Admin",
    },
  },
  teamMembers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
