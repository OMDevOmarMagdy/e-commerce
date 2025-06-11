const express = require("express");
const router = express.Router();
const { register, login, verifyOTP } = require("../controllers/authController");

const {
  validateRegister,
  validateLogin,
} = require("../middleware/validateInput");

const { loginLimiter } = require("../middleware/rateLimiter");
const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  next();
};

router.post("/register", validateRegister, validate, register);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginLimiter, validateLogin, validate, login);

module.exports = router;
