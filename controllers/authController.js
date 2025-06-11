const crypto = require("crypto");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");

// ==============================================================================

// Generate random 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ==============================================================================

// Register new user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ message: "User already exists" });

  const otp = generateOTP();
  const otpExpires = Date.now() + 10 * 60 * 1000; // valid for 10 minutes

  const user = await User.create({ name, email, password, otp, otpExpires });

  await sendEmail(
    email,
    "Verify your email (OTP)",
    `Your OTP for registration is: ${otp}`
  );

  res.status(201).json({ message: "OTP sent to your email. Please verify." });
};

// ==============================================================================

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  // console.log(otp);

  if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  const token = generateToken(user);
  res.json({ message: "Email verified successfully", token });
};

// ==============================================================================

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user);
  res.json({ token });
};
