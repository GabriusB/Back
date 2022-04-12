const jwt = require("jsonwebtoken");
const User = require("../model/authModel");

const protect = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        return res.send({ success: false });
      }

      const user = await User.findById(decodedToken.id);
      if (user) {
        next();
      } else {
        return res.send({ success: false });
      }
    });
  }
  if (!token) {
    return res.send({ success: false });
  }
};

module.exports = { protect };

