import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export enum ActionType {
    BOOK = "BOOK",
    USE = "USE",
    RETURN = "RETURN",
}

export class CreateActionDTO {

    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    vehicleId: string;

    @IsEnum(ActionType, {
        message: 'actionType must be one of BOOK, USE, RETURN',
    })
    @IsNotEmpty()
    actionType: ActionType;
}

export class UpdateActionDTO {

    @IsString()
    @IsNotEmpty()
    userId?: string;

    @IsString()
    @IsNotEmpty()
    vehicleId?: string;

    @IsEnum(ActionType, {
        message: 'actionType must be one of BOOK, USE, RETURN',
    })
    @IsNotEmpty()
    actionType?: ActionType;
}
