import jwt from "jsonwebtoken";

/**
 * Generate a JWT access token for a user.
 * @param {Object} user - The user object containing _id, email, and role.
 * @returns {string} - The signed JWT token.
 */
const generateAccessToken = (user) => {
  const payload = {
    userId: user._id,
    email: user.email || null,
    role: user.role || "user",
  };

  const secret = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;
  const expiresIn = process.env.ACCESS_TOKEN_EXPIRE || "15m";

  return jwt.sign(payload, secret, { expiresIn });
};

export default generateAccessToken;
