import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

const RWANDA_PLATE_REGEX = /^RA[A-Z] \d{3}[A-Z]$/;

export class CreateVehicleDTO {

    @IsString()
    @MinLength(6)
    @MaxLength(10)
    @Matches(RWANDA_PLATE_REGEX, {
        message: 'Plate number must match Rwanda format: e.g. "RAB 123A".',
    })
    @IsNotEmpty()
    plateNumber: string;

    @IsString()
    @IsNotEmpty()
    color: string;

    @IsString()
    @IsNotEmpty()
    modelId: string;
}

export class UpdateVehicleDTO {

    @IsOptional()
    @IsString()
    @MinLength(6)
    @MaxLength(10)
    @Matches(RWANDA_PLATE_REGEX, {
        message: 'Plate number must match Rwanda format: e.g. "RAB 123A".',
    })
    plateNumber?: string;

    @IsOptional()
    @IsString()
    color?: string;

    @IsOptional()
    @IsString()
    modelId?: string;

    @IsOptional()
    @IsBoolean()
    isAvailable?: boolean;
}
