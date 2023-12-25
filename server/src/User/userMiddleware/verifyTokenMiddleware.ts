import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";

import config from "../jwtConfig";
import { userProps } from "../user.types";

export const verifyTokenMiddleware = (token: string) => {
  try {
    if (!token) return null;

    const verifiedTokenData = jwt.verify(token, config.secret);

    if (typeof verifiedTokenData === "string") return null;

    return jwtDecode<userProps>(token);
  } catch (e) {
    console.log(e);
    return null;
  }
};
