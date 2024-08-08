const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    github: {
      type: String,
      validate: {
        validator: (v) => {
          return v === "" || validator.isURL(v);
        },
        message: (props) => "Please enter a valid URL",
      },
    },
    profilePicture: { type: String },
    cv: { type: String },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long."],
      // créé un bug pour raison inconnue
      // maxlength: [10, "Password must be at most 10 characters long."],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
