const User = require("../model/authModel");
const Topics = require("../model/topicModel");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        res.json({ status: false });
        next();
      } else {
        const user = await User.findById(decodedToken.id);
        const userTopics = await Topics.find({
          username: user.username,
        });

        const notifications = userTopics.filter((x) => x.notification === true);
        if (user)
          res.json({
            status: true,
            user: user,
            userTopics: userTopics,
            notifications: notifications.length,
          });
        else res.json({ status: false });
        next();
      }
    });
  } else {
    res.json({ status: false });
    next();
  }
};

const registerValidation = async (req, res, next) => {
  const { username, passwordOne, passwordTwo } = req.body;

  if (username.length > 15 || username.length < 5) {
    return res.send({
      success: false,
      message: "Username length has to be between 5-15 characters",
    });
  }
  if (passwordOne.length > 20 || passwordOne.length < 5) {
    return res.send({
      success: false,
      message: "Password length has to be between 5-20 characters",
    });
  }
  if (passwordOne !== passwordTwo) {
    return res.send({ success: false, message: "Passwords must match" });
  }

  const user = await User.findOne({ username });

  if (user) {
    return res.send({ success: false, message: "Username is taken" });
  }

  next();
};

const loginValidation = async (req, res, next) => {
  const { username, password } = req.body;

  if (username.length > 15 || username.length < 5) {
    return res.send({
      success: false,
      message: "Bad Credentials",
    });
  }

  const user = await User.findOne({ username });
  if (!user) {
    return res.send({ success: false, message: "Bad Credentials" });
  }

  const auth = await bcrypt.compare(password, user.password);
  if (!auth) {
    return res.send({ success: false, message: "Bad Credentials" });
  }

  next();
};

module.exports = { checkUser, registerValidation, loginValidation };

