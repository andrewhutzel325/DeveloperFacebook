const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const keys = require("../../config/keys");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator/check");

// @route GET api/auth
// @desc Test route
// @access Public
router.get("/", auth, async (req, res) => {
  try {
    //Takes user, we do not want the password though which is why we do a select -password
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route Post api/auth
// @desc Auth user and retrieve token
// @access Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        keys.jwtSecret,
        { expiresIn: 3600000 },
        (err, token) => {
          if (err) throw err;

          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
