const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    // comment
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = generateToken;
