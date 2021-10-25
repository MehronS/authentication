const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());
const {
  models: { User },
} = require("./db");
const path = require("path");

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

// User.prototype.generateToken = async function () {
//   try {
//     const token = await jwt.sign({ id: this.id }, process.env.JWT);
//     return { token };
//   } catch (err) {
//     console.error(err);
//   }
// };

app.post("/api/auth", async (req, res, next) => {
  try {
    const user = await User.authenticate(req.body);
    if (!user) res.sendStatus(404);
    const token = await user.generateToken();
    res.send(token);
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/auth", async (req, res, next) => {
  try {
    res.send(await User.byToken(req.headers.authorization));
  } catch (ex) {
    next(ex);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send({ error: err.message });
});

module.exports = app;
