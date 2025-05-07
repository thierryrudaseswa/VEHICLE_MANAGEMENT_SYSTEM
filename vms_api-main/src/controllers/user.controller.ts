import { compareSync, hashSync } from "bcrypt";
import { config } from "dotenv";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/prisma-client";
import { AuthRequest } from "../types";
import ServerResponse from "../utils/ServerResponse";
import { User } from "@prisma/client";

config();

const createUser = async (req: Request, res: Response) => {
  try {
    const { email, names, telephone, password,role } = req.body;
    console.log("body", req.body);
    const hashedPassword = hashSync(password, 10);
    console.log("hashedPassword", hashedPassword);
    const user = await prisma.user.create({
      data: {
        email,
        names,
        role,
        password: hashedPassword,
        telephone,
      },
    });
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "3d" }
    );
    return ServerResponse.created(res, "User created successfully", {
      user,
      token,
    });
  } catch (error: any) {
    console.log("error", error);
    if (error.code === "P2002") {
      const key = error.meta.target[0];
      return ServerResponse.error(
        res,
        `${key.charAt(0).toUpperCase() + key.slice(1)} (${
          req.body[key]
        }) already exists`,
        400
      );
    }
    return ServerResponse.error(res, "Error occured", { error });
  }
};

const updateUser: any = async (req: AuthRequest, res: Response) => {
  try {
    const { email, names, telephone } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        email,
        names,
        telephone,
      },
    });
    return ServerResponse.success(res, "User updated successfully", { user });
  } catch (error: any) {
    if (error.code === "P2002") {
      const key = error.meta.target[0];
      return ServerResponse.error(
        res,
        `${key.charAt(0).toUpperCase() + key.slice(1)} (${
          req.body[key]
        }) already exists`,
        400
      );
    }
    return ServerResponse.error(res, "Error occured", { error });
  }
};

const me: any = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    return ServerResponse.success(res, "User fetched successfully", { user });
  } catch (error) {
    return ServerResponse.error(res, "Error occured", { error });
  }
};

const all = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({});
    return ServerResponse.success(res, "User updated successfully", { users });
  } catch (error) {
    return ServerResponse.error(res, "Error occured", { error });
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    return ServerResponse.success(res, "User fetched successfully", { user });
  } catch (error) {
    return ServerResponse.error(res, "Error occured", { error });
  }
};

const searchUser = async (req: Request, res: Response) => {
  try {
    const { query } = req.params;
    const users = await prisma.user.findMany({
      where: { names: { contains: query, mode: "insensitive" } },
    });
    return ServerResponse.success(res, "Users fetched successfully", { users });
  } catch (error) {
    return ServerResponse.error(res, "Error occured", { error });
  }
};

const deleteUser: any = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.delete({ where: { id: req.user.id } });
    return ServerResponse.success(res, "User deleted successfully", { user });
  } catch (error) {
    return ServerResponse.error(res, "Error occured", { error });
  }
};

const removeAvatar: any = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        profilePicture:
          "https://firebasestorage.googleapis.com/v0/b/relaxia-services.appspot.com/o/relaxia-profiles%2Fblank-profile-picture-973460_960_720.webp?alt=media",
      },
    });
    return ServerResponse.success(res, "User updated successfully", { user });
  } catch (error) {
    return ServerResponse.error(res, "Error occured", { error });
  }
};

const deleteById = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.delete({ where: { id: req.params.id } });
    return ServerResponse.success(res, "User deleted successfully", { user });
  } catch (error) {
    return ServerResponse.error(res, "Error occured", { error });
  }
};

const updateAvatar: any = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        profilePicture: req.body.url,
      },
    });
    return ServerResponse.success(res, "User updated successfully", { user });
  } catch (error) {
    return ServerResponse.error(res, "Error occured", { error });
  }
};

const updatePassword: any = async (req: AuthRequest, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) ServerResponse.error(res, "User not found", 404);
    const isPasswordValid = compareSync(oldPassword, (user as User).password);
    if (!isPasswordValid)
      return ServerResponse.error(res, "Invalid old password", 400);
    const hashedPassword = hashSync(newPassword, 10);
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        password: hashedPassword,
      },
    });
    return ServerResponse.success(res, "Password updated successfully", {
      user: updatedUser,
    });
  } catch (error) {
    return ServerResponse.error(res, "Error occured", { error });
  }
};

const userController = {
  createUser,
  updateUser,
  me,
  all,
  getById,
  searchUser,
  deleteUser,
  removeAvatar,
  deleteById,
  updateAvatar,
  updatePassword,
};

export default userController;
