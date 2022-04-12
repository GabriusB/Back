const Topics = require("../model/topicModel");

const createNewTopic = async (req, res) => {
  const { username, content, title, description, image } = req.body;
  await Topics.create({
    username: username,
    image: image,
    description: description,
    title: title,
    content: content,
    comments: [],
    notification: false,
  });

  const allTopics = await Topics.find().sort({ _id: -1 }).limit(10);
  res.send({
    success: true,
    data: allTopics,
  });
};

const getAllTopics = async (req, res) => {
  let topics;

  if (req.params.page === 1) {
    topics = await Topics.find().sort({ _id: -1 }).limit(10);
  } else {
    topics = await Topics.find()
      .sort({ _id: -1 })
      .skip(req.params.page * 10 - 10)
      .limit(10);
  }

  const allTopics = await Topics.find();

  res.send({ data: topics, topics: allTopics.length });
};

const getTopic = async (req, res) => {
  const { id } = req.params;

  const singleTopic = await Topics.findByIdAndUpdate(
    { _id: id },
    { new: true }
  );
  res.send({ success: true, data: singleTopic });
};

const addComment = async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;

  let topic = await Topics.findByIdAndUpdate(
    { _id: id },
    {
      $push: {
        comments: { ...req.body, id: id },
      },
    },
    { new: true }
  );
  if (username !== topic.username) {
    topic = await Topics.findByIdAndUpdate(
      { _id: id },
      { notification: true },
      { new: true }
    );
  }

  res.send({ success: true });
};

const getFavorites = async (req, res) => {
  const favorites = req.body.favoriteItems;
  const topics = await Topics.find({ _id: { $in: favorites } }).sort({
    _id: -1,
  });

  if (topics.length === 0) {
    return res.send({ success: false });
  }

  res.send({ success: true, data: topics });
};

const getTopics = async (req, res) => {
  const userTopics = await Topics.find({ username: req.body.username }).sort({
    _id: -1,
  });

  res.send({ success: true, data: userTopics });
};

const updateNotificationState = async (req, res) => {
  await Topics.findByIdAndUpdate({ _id: req.body.id }, { notification: false });

  res.send({ success: true });
};

module.exports = {
  getFavorites,
  createNewTopic,
  getAllTopics,
  getTopic,
  addComment,
  getTopics,
  updateNotificationState,
};

