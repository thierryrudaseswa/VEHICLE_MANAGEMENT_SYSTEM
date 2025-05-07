import { Request, Response } from "express";
import prisma from "../../prisma/prisma-client";
import { CreateVehicleModelDTO, UpdateVehicleModelDTO } from "../dtos/model.dto";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

const createVehicleModel = async (req: Request, res: Response) => {
    const dto = plainToInstance(CreateVehicleModelDTO, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        const vehicleModel = await prisma.vehicleModel.create({
            data: {
                name: dto.name,
                brand: dto.brand,
            },
        });
        return res.status(201).json(vehicleModel);
    } catch (error) {
        return res.status(500).json({ message: "Failed to create vehicle model", error });
    }
};

const getVehicleModels = async (req: Request, res: Response) => {
    try {
        const vehicleModels = await prisma.vehicleModel.findMany();
        return res.status(200).json(vehicleModels);
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch vehicle models", error });
    }
};

const getVehicleModelById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const vehicleModel = await prisma.vehicleModel.findUnique({
            where: { id },
        });
        if (!vehicleModel) {
            return res.status(404).json({ message: "Vehicle model not found" });
        }
        return res.status(200).json(vehicleModel);
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch vehicle model", error });
    }
};

const updateVehicleModel = async (req: Request, res: Response) => {
    const { id } = req.params;
    const dto = plainToInstance(UpdateVehicleModelDTO, req.body);
    const errors = await validate(dto, { skipMissingProperties: true });
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        const vehicleModel = await prisma.vehicleModel.update({
            where: { id },
            data: {
                name: dto.name,
                brand: dto.brand,
            },
        });
        return res.status(200).json(vehicleModel);
    } catch (error) {
        return res.status(500).json({ message: "Failed to update vehicle model", error });
    }
};

const deleteVehicleModel = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.vehicleModel.delete({
            where: { id },
        });
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete vehicle model", error });
    }
};


const getAllVehicleModelsPaginated = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const [vehicleModels, total] = await prisma.$transaction([
      prisma.vehicleModel.findMany({
        skip,
        take: limit,
      }),
      prisma.vehicleModel.count(),
    ]);

    return res.status(200).json({
      data: vehicleModels,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch paginated vehicles", error });
  }
};

const modelController = {
    createVehicleModel,
    getVehicleModels,
    getVehicleModelById,
    updateVehicleModel,
    deleteVehicleModel,
    getAllVehicleModelsPaginated
};

export default modelController;
