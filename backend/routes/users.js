import express from "express";
import {
  signup,
  login,
  updateUser,
  deleteUser,
  getAllUsers,
  getProfile,
} from "../controller/users.js";

import {
  authMiddleware,
  adminMiddleware,
} from "../middleware/auth.js";

const usersRouter = express.Router();

usersRouter.post("/signup", signup);
usersRouter.post("/login", login);

usersRouter.get("/profile", authMiddleware, getProfile);

usersRouter.get("/", authMiddleware, adminMiddleware, getAllUsers);
usersRouter.put("/:id", authMiddleware, adminMiddleware, updateUser);
usersRouter.delete("/:id", authMiddleware, adminMiddleware, deleteUser);

export default usersRouter;