const User = require("../model/authModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: maxAge,
  });
};

const register = async (req, res) => {
  const { username, passwordOne } = req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(passwordOne, salt);

  const user = await User.create({
    username,
    password: hashedPassword,
    picture:
      "https://www.icmetl.org/wp-content/uploads/2020/11/user-icon-human-person-sign-vector-10206693.png",
  });

  res.send({ user: user._id, success: true });
};

const login = async (req, res) => {
  const { username } = req.body;

  const user = await User.findOne({ username });

  const token = createToken(user._id);

  res.cookie("jwt", token, { httpOnly: false, maxAge: maxAge * 1000 });

  return res.send({ user: user, success: true });
};

module.exports = { register, login };
