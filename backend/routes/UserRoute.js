const express = require("express");
const router = express.Router();
const User = require("../module/User");
const { generateToken, jwtAuthMiddlware } = require("../jwt");
// const { body, validationResult } = require("express-validator");
// const jwt = require("jsonwebtoken");
const success = false;

router.post("/register", async (req, res) => {
  try {
    const data = req.body;
    const NewPerson = new User(data);
    const response = await NewPerson.save();

    const payload = {
      id: response.id,
      email: response.email,
    };
    const token = generateToken(payload);
    res.status(201).json({
      message: "User registered successfully",
      user: response,
      token: token,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({
        message: "Error registering user",
        error: err.message,
        success: false,
      });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if(!user) {
      return res
        .status(200)
        .json({ message: "Enter valid email or password", success: false });
    }

    if (!email || !(await user.comparePassword(password))) {
      return res
        .status(200)
        .json({ message: "Enter valid email or password", success: false });
    }

    const payload = {
      id: user.id,
      email: user.email,
    };
    const token = generateToken(payload);

    res.json({ token: token, success: true, message: "Login successful" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", success: false, error: error });
  }
});

router.get("/alluser", jwtAuthMiddlware, async (req, res) => {
  try {
    const response = await User.find();
    res.status(200).json({
      message: "All users",
      users: response,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
});

router.get("/profile", jwtAuthMiddlware, async (req, res) => {
  try {
    const userData = req.user;
    console.log("user data", userData);
    const userId = userData.id;
    const user = await User.findById(userId).select("-password -__v");

    res.status(200).json({ user, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
});

module.exports = router;
