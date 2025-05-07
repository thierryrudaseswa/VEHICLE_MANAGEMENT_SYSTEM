import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthMiddleware, AuthRequest } from "../types";
import prisma from "../../prisma/prisma-client";
import ServerResponse from "../utils/ServerResponse";

export const checkLoggedIn: any = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return ServerResponse.unauthenticated(res, "You are not logged in");
    }

    const token = authHeader.split(" ")[1];

    const response = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

    if (!response)
      return ServerResponse.unauthenticated(res, "You are not logged in");

    req.user = { id: (response as any).id };
    next();
  } catch (error) {
    console.log("JWT verification error:", error);
    return ServerResponse.error(res, "Invalid or expired token");
  }
};


export const checkAdmin: any = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization
    if (!token) return ServerResponse.unauthorized(res, "You are not an admin");
    const response = await jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string,
      {}
    );
    if (!response)
      return ServerResponse.unauthorized(res, "You are not an admin");
    const user = await prisma.user.findUnique({
      where: { id: (response as any).id },
    });
    if (!user) return ServerResponse.unauthorized(res, "You are not logged in");
    if (user.role != "ADMIN")
      return ServerResponse.unauthorized(
        res,
        "You're not allowed to access this resource"
      );
    req.user = { id: user.id };
    next();
  } catch (error) {
    console.log(error);
    return ServerResponse.error(res, "Internal server error 500.");
  }
};
