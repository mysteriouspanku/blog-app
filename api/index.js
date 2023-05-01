const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authController = require("./controllers/AuthController");
const app = express();
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const { default: PostController } = require("./controllers/PostController");

const port = process.env.PORT || 4000;

// connect mongoose to mongodb
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

// The cors package in Node.js is a middleware that can be used
// to enable CORS on an Express.js application. It adds the
// necessary CORS headers to the responses sent from the server,
// and allows the client to access the server's resources from
// other domains.
// The cors() function takes an options object as an argument.
// The origin option specifies the origin of the request.

// The credentials option specifies whether the request should
// be allowed to pass the credentials (cookies, authorization
// headers, etc.) to the server.
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// The express.json() method in Express.js is a built-in
// middleware function in Express.js. It parses incoming
// requests with JSON payloads and is based on body-parser.
app.use(express.json());

// The cookie-parser middleware parses cookies attached to the
// client request object. The parsed cookies are stored in
// req.cookies.
app.use(cookieParser());

// The express.static() function is a built-in Express.js
// middleware function that can be used to serve static files.
// The function takes one argument which is the absolute path
// of the directory where the static assets are located.
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(authController);
app.use(PostController);

app.listen(port, () => {
  console.log("Server is running on port ", port);
});
