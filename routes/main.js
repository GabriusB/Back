const router = require("express").Router();

const { protect } = require("../middlewares/protect");

const { changeImage } = require("../controllers/userController");

const { register, login } = require("../controllers/authControllers");
const {
  checkUser,
  registerValidation,
  loginValidation,
} = require("../middlewares/authMiddleware");

const {
  createNewTopic,
  getAllTopics,
  getTopic,
  addComment,
  getFavorites,
  getTopics,
  updateNotificationState,
} = require("../controllers/topicController");

router.post("/", checkUser);
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/create-new-topic", protect, createNewTopic);
router.post("/favorites", getFavorites);
router.post("/get-topics", protect, getTopics);
router.post("/notification", protect, updateNotificationState);
router.post("/comment/:id", protect, addComment);
router.post("/change-image", protect, changeImage);

router.get("/topic/:id", getTopic);
router.get("/all-topics/:page", getAllTopics);

module.exports = router;

