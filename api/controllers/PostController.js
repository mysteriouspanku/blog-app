const PostController = require("express").Router();
const multer = require("multer");
const fs = require("fs");
const PostModel = require("../models/Post");
const jwt = require("jsonwebtoken");

const uploadMiddleware = multer({ dest: "uploads/" });

PostController.post(
  "/createpost",
  uploadMiddleware.single("file"),
  async (req, res) => {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const extension = parts[parts.length - 1];
    const newPath = path + "." + extension;
    fs.rename(path, newPath, () => {});

    const { token } = req.cookies;
    jwt.verify(token, process.env.SECRET_KEY, async (err, info) => {
      if (err) throw err;
      const { title, summary, content } = req.body;
      const postDoc = await PostModel.create({
        title,
        summary,
        content,
        coverImage: newPath,
        author: info.id,
      });
      res.json(postDoc);
    });
  }
);

PostController.get("/posts", async (req, res) => {
  const posts = await PostModel.find()
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(posts);
});

PostController.get("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await PostModel.findById(id).populate({
    path: "author",
    select: "-password",
  });
  res.json(postDoc);
});

PostController.put(
  "/post",
  uploadMiddleware.single("file"),
  async (req, res) => {
    let newPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const extension = parts[parts.length - 1];
      newPath = path + "." + extension;
      fs.rename(path, newPath, () => {});
    }
    const { id, title, summary, content } = req.body;
    const { token } = req.cookies;
    jwt.verify(token, process.env.SECRET_KEY, async (err, info) => {
      if (err) throw err;
      const postDoc = await PostModel.findById(id);
      const isAuthor =
        JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res
          .status(400)
          .json({ error: "You are not the author of this post" });
      }
      await postDoc.updateOne({
        title,
        summary,
        content,
        coverImage: newPath || postDoc.coverImage,
      });
      res.json(postDoc);
    });
  }
);

PostController.delete("/deletePost/:id", async (req, res) => {
  const { id } = req.params;
  const { token } = req.cookies;
  jwt.verify(token, process.env.SECRET_KEY, async (err, info) => {
    if (err) throw err;
    const postDoc = await PostModel.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res
        .status(400)
        .json({ error: "You are not the author of this post" });
    }
    const coverImagePath = postDoc.coverImage;
    await postDoc.deleteOne();

    if (coverImagePath) {
      fs.unlink(coverImagePath, (err) => {
        if (err) throw err;
      });
    }

    res.json(postDoc);
  });
});

exports.default = PostController;
