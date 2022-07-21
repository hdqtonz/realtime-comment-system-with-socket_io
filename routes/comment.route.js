const router = require("express").Router();
const Comment = require("../models/comment");

router.post("/comments", async (req, res) => {
  try {
    const body = req.body;
    const comment = await new Comment(body);
    await comment.save();
    res.status(201).json(comment);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/comments", async (req, res) => {
  try {
    const comment = await Comment.find({});
    res.status(200).send(comment);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
