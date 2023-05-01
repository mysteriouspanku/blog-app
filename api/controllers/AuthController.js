const authController = require("express").Router();
const UserModel = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const saltRounds = 10;

// Register a new user
authController.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const isExisting = await UserModel.findOne({ username });

  if (isExisting) {
    return res.status(400).json({ error: "User already exists" });
  }

  try {
    const userDoc = await UserModel.create({
      username,
      password: bcrypt.hashSync(password, saltRounds),
    });
    // generate a token
    jwt.sign(
      { username, id: userDoc._id },
      process.env.SECRET_KEY,
      (err, token) => {
        if (err) {
          res.status(400).json(err);
        } else {
          res.cookie("token", token).json({ username, id: userDoc._id });
        }
      }
    );
  } catch (error) {
    res.status(400).json(error);
  }
});

// Login an existing user
authController.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await UserModel.findOne({ username });

  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      // Generate a token
      jwt.sign(
        { username, id: userDoc._id },
        process.env.SECRET_KEY,
        (err, token) => {
          if (err) {
            res.status(400).json(err);
          } else {
            res.cookie("token", token).json({
              username,
              id: userDoc._id,
            });
          }
        }
      );
    } else {
      res.status(400).json({ error: "Invalid password" });
    }
  } else {
    res.status(400).json({ error: "Invalid username" });
  }
});

// Logout a user
authController.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

// get user profile from cookies
authController.get("/profile", async (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.SECRET_KEY, (err, info) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.json(info);
    }
  });
});

module.exports = authController;
