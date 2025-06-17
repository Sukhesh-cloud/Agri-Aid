const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const authController = require("../controllers/authController");


const User = require('../models/User');

router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error', err });
  }
});

router.post("/register", register);
router.post("/login", login);
router.get("/user/:id", authController.getUserById);

module.exports = router;
