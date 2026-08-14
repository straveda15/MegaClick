import jwt from "jsonwebtoken";

/**
 * Generate a JWT refresh token for a user.
 * @param {Object} user - The user object containing _id.
 * @returns {string} - The signed JWT token.
 */
const generateRefreshToken = (user) => {
  const payload = {
    userId: user._id,
  };

  const secret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_REFRESH_SECRET;
  const expiresIn = process.env.REFRESH_TOKEN_EXPIRE || "7d";

  return jwt.sign(payload, secret, { expiresIn });
};

export default generateRefreshToken;
