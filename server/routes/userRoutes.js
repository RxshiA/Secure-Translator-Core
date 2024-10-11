/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const authMiddleware = require("../middleware/authMiddleware");

const JWT_SECRET = process.env.JWT_SECRET;

// Register
router.post("/email-signup", async (req, res) => {
  try {
    let { first_name, last_name, email, password } = req.body;

    // validate
    if (!first_name || !email || !password || !last_name)
      return res.status(400).json({ msg: "Not all fields have been entered." });
    if (password.length < 5)
      return res
        .status(400)
        .json({ msg: "The password needs to be at least 5 characters long." });

    const existingUser = await User.findOne({ email: email });
    if (existingUser)
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });

    if (!first_name) first_name = email;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      first_name,
      last_name,
      email,
      password: passwordHash,
    });
    await newUser.save();
    jwt.sign(
      { user: newUser },
      JWT_SECRET,
      { expiresIn: "24h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Register - Google OAuth
router.post("/oauth-signup", async (req, res) => {
  try {
    let { first_name, last_name, email, googleId } = req.body;

    if (!first_name || !email || !googleId || !last_name)
      return res.status(400).json({ msg: "Not all fields have been entered." });

    const existingUser = await User.findOne({ email: email });
    if (existingUser)
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });

    const newUser = new User({
      first_name,
      last_name,
      email,
      provider: "google",
      googleId: googleId,
    });
    await newUser.save();
    jwt.sign(
      { user: newUser },
      JWT_SECRET,
      { expiresIn: "24h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//User Profile details
router.post("/profile", async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.user.id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ status: "error", data: "User not found" });
    }
    console.log(user);
    res.send({ status: "ok", data: user });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.send({ status: "error", data: "token expired" });
    }
    res.status(500).json({ error: err.message });
  }
});

//Login
router.post("/email-login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user)
      return res
        .status(400)
        .json({ msg: "No account with this email has been registered." });
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ user: { id: user._id } }, JWT_SECRET, {
        expiresIn: "24h",
      });
      if (res.status(201)) return res.json({ status: "ok", data: token });
      else return res.json({ error: "Invalid credentials" });
    }
    res.json({ error: "Invalid credentials" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Login - Google OAuth
router.post("/oauth-login", async (req, res) => {
  try {
    const { email, googleId } = req.body;
    const user = await User.findOne({ email: email, googleId: googleId });
    if (!user)
      return res
        .status(400)
        .json({ msg: "No account with this email has been registered." });

    const token = jwt.sign({ user: { id: user._id } }, JWT_SECRET, {
      expiresIn: "24h",
    });
    if (res.status(201)) return res.json({ status: "ok", data: token });
    else return res.json({ error: "Invalid credentials" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Verify a token and return the user
router.post("/verify-token", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(400).json({ msg: "Token is not valid." });
    res.json({ status: "ok", data: user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
