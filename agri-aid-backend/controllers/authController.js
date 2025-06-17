const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, location } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword, role, location  });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role, location: user.location }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ token, role: user.role, name: user.name });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role, location: user.location }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, role: user.role, name: user.name });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};
