import { Request, Response } from "express";
import prisma from "../../prisma/prisma-client";
import { CreateActionDTO, UpdateActionDTO } from "../dtos/action.dto";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

const createAction = async (req: Request, res: Response) => {
    const dto = plainToInstance(CreateActionDTO, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        const action = await prisma.action.create({
            data: {
                userId: dto.userId,
                vehicleId: dto.vehicleId,
                actionType: dto.actionType,
            },
        });
        return res.status(201).json(action);
    } catch (error) {
        return res.status(500).json({ message: "Failed to create action", error });
    }
};

const getActions = async (req: Request, res: Response) => {
    try {
        const actions = await prisma.action.findMany({
            include:{
                vehicle:true,
                user:true
            }
        });
        return res.status(200).json(actions);
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch actions", error });
    }
};

const getActionById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const action = await prisma.action.findUnique({
            where: { id },
        });
        if (!action) {
            return res.status(404).json({ message: "Action not found" });
        }
        return res.status(200).json(action);
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch action", error });
    }
};

const updateAction = async (req: Request, res: Response) => {
    const { id } = req.params;
    const dto = plainToInstance(UpdateActionDTO, req.body);
    const errors = await validate(dto, { skipMissingProperties: true });
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        const action = await prisma.action.update({
            where: { id },
            data: {
                userId: dto.userId,
                vehicleId: dto.vehicleId,
                actionType: dto.actionType,
            },
        });
        return res.status(200).json(action);
    } catch (error) {
        return res.status(500).json({ message: "Failed to update action", error });
    }
};

const deleteAction = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.action.delete({
            where: { id },
        });
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete action", error });
    }
};

const actionController = {
    createAction,
    getActions,
    getActionById,
    updateAction,
    deleteAction,
};

export default actionController;
