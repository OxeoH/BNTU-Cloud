import jwt from "jsonwebtoken";
import config from "../jwtConfig";
export const generateAccessToken = (id: string, login: string) => {
  const payload = {
    id,
    login,
  };

  return jwt.sign(payload, config.secret, { expiresIn: "24h" });
};
