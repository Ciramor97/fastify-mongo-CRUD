const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: async (v) => {
        var strongRegex = new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
        );
        return strongRegex.test(v);
      },
      message: (props) =>
        "Password must contain at least 1 lowercase, 1 uppercase,  1 numeric character, one special character and must be eight characters or longer",
    },
  },
  role: {
    type: String,
    enum: ["Admin", "Project Manager", "Team member"],
    default: "Team member",
    required: true,
  },
});

UserSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password") || this.isNew) {
      // const salt = await bcrypt.genSalt(10)
      this.password = bcrypt.hashSync(this.password, 10);
    }
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const User = mongoose.model("User", UserSchema);

module.exports = User;
