const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "https://volunizehub.web.app",
      "https://volunizehub.firebaseapp.com",
    ],
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log(`server running on port : ${port}`);
});
