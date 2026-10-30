import jwt from "jsonwebtoken";
import * as config from "../config/config.js";
import User from "../model/users.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      ok: false,
      message: "Please login first",
    });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.SECRET_KEY);

    req.user = { userId: decoded.userId };

    next();
  } catch {
    return res.status(401).json({
      ok: false,
      message: "Invalid or expired token",
    });
  }
};

export const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "User not found",
      });
    }

    if (user.isAdmin !== true) {
      return res.status(403).json({
        ok: false,
        message: "Admin access required",
      });
    }

    next();
  } catch {
    return res.status(500).json({
      ok: false,
      message: "Unable to verify admin access",
    });
  }
};