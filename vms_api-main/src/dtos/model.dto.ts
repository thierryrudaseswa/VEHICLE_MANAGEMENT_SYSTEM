import { IsNotEmpty, IsString, MaxLength, MinLength, IsOptional } from "class-validator";

export class CreateVehicleModelDTO {

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    @IsNotEmpty()
    name: string;

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    @IsNotEmpty()
    brand: string;
}

export class UpdateVehicleModelDTO {

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name?: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    brand?: string;
}
