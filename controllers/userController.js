const User = require("../model/authModel");
const Topics = require("../model/topicModel");

const changeImage = async (req, res) => {
  const user = await User.findOneAndUpdate(
    { username: req.body.username },
    { picture: req.body.image },
    { new: true }
  );

  await Topics.updateMany(
    { username: req.body.username },
    { $set: { image: req.body.image } },
    { multi: true }
  );

  res.send({ success: true, data: user });
};

module.exports = { changeImage };

