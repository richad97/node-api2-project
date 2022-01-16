// implement your posts router here
const express = require("express");
const postsModel = require("./posts-model.js");
const router = express.Router();

// GET /api/posts
router.get("/", async (req, res) => {
  try {
    const postsArray = await postsModel.find();

    res.json(postsArray);
  } catch (err) {
    res
      .status(500)
      .json({ message: "The posts information could not be retrieved" });
  }
});

// GET /api/posts/:id
router.get("/:id", async (req, res) => {
  try {
    const postObj = await postsModel.findById(req.params.id);

    if (postObj === undefined) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    } else {
      res.json(postObj);
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "The posts information could not be retrieved" });
  }
});

// POST /api/posts
router.post("/", async (req, res) => {
  try {
    const incomingPost = {
      title: req.body.title,
      contents: req.body.contents,
    };
    if (!incomingPost.title || !incomingPost.contents) {
      res.status(400).json({
        message: "Please provide title and contents for the post",
      });
    } else {
      const insertedPost = await postsModel.insert(incomingPost);
      const newPost = await postsModel.findById(insertedPost.id);
      res.status(201).json(newPost);
    }
  } catch (err) {
    res.status(500).json({
      message: "There was an error while saving the post to the database",
    });
  }
});

// PUT /api/posts
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const incomingPost = { title: req.body.title, contents: req.body.contents };
    const foundID = await postsModel.findById(id);

    if (foundID === undefined) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    } else if (!incomingPost.title || !incomingPost.contents) {
      res.status(400).json({
        message: "provide title and contents",
      });
    } else {
      await postsModel.update(id, incomingPost);
      const updatedUser = await postsModel.findById(id);
      res.status(200).json(updatedUser);
    }
  } catch (err) {
    res.status(500).json({
      message: "The post information could not be modified",
    });
  }
});

// DELETE /api/posts/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const foundByID = await postsModel.findById(id);

    if (foundByID === undefined) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    } else {
      await postsModel.remove(id);

      res.status(200).json(foundByID);
    }
  } catch (err) {
    res.status(500).json({ message: "The post could not be removed" });
  }
});

// GET /api/posts/:id/comments
router.get("/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const foundByID = await postsModel.findById(id);

    if (foundByID === undefined) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    } else {
      const postComments = await postsModel.findPostComments(id);

      res.status(200).json(postComments);
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "The comments information could not be retrieved" });
  }
});

module.exports = router;
