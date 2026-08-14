import jwt from "jsonwebtoken";

/**
 * Verify a JWT token with a given secret.
 * @param {string} token - The JWT token to verify.
 * @param {string} secret - The secret used to sign the token.
 * @returns {Promise<Object>} - The decoded payload.
 * @throws {Error} - If verification fails.
 */
const verifyToken = (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
};

export default verifyToken;
