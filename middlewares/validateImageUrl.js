const validateImageUrl = (req, res, next) => {
  const { image } = req.body;

  if (!image.includes("http")) {
    return res.send({
      success: false,
      message: "image link must include http at the beginning",
    });
  }
  next();
};

module.exports = { validateImageUrl };

