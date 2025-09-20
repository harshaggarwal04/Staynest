const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { uploadProfile } = require("../cloudConfig.js"); // use profile upload

const User = require("../Models/User.js");

// ================= USER REGISTER =================
router.post("/register", uploadProfile.single("profileImage"), async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const profileImage = req.file;
    if (!profileImage) return res.status(400).json({ message: "No profile image uploaded" });

    const profileImagePath = profileImage.path;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: "User already exists!" });

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profileImagePath,
    });

    await newUser.save();
    res.status(200).json({ message: "User registered successfully!", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed!", error: err.message });
  }
});

// ================= USER LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(409).json({ message: "User does not exist!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    user.password = undefined;

    res.status(200).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
