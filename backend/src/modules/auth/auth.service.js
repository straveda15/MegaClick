import jwt from "jsonwebtoken";
import RefreshToken from "./token.model.js";
import generateAccessTokenUtil from "../../shared/utils/generateAccessToken.js";
import generateRefreshTokenUtil from "../../shared/utils/generateRefreshToken.js";
import verifyTokenUtil from "../../shared/utils/verifyToken.js";

export const generateAccessToken = (user) => {
  return generateAccessTokenUtil(user);
};

export const generateRefreshToken = async (user, ipAddress) => {
  const token = generateRefreshTokenUtil(user);

  const decoded = jwt.decode(token);
  const expiresAt = new Date(decoded.exp * 1000);

  const refreshToken = await RefreshToken.create({
    userId: user._id,
    token,
    expiresAt,
    createdByIp: ipAddress,
  });

  return refreshToken.token;
};

export const verifyRefreshToken = async (token) => {
  try {
    const secret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_REFRESH_SECRET;
    const decoded = await verifyTokenUtil(token, secret);
    
    const refreshToken = await RefreshToken.findOne({
      token,
      userId: decoded.userId,
      isRevoked: false,
    });

    if (!refreshToken) {
      throw new Error("Invalid or revoked refresh token.");
    }

    return decoded;
  } catch (error) {
    throw new Error(error.message || "Invalid refresh token.");
  }
};