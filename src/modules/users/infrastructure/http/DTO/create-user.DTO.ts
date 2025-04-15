import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString, MaxLength, MinLength } from "class-validator";
import { UserRole } from "../../../../../models";

export class CreateUserDTO {
    @IsNotEmpty()
    @IsString()
    @MinLength(3, { message: "name cannot less than 3 character" })
    name: string;

    @IsNotEmpty()
    @IsPhoneNumber("IR", { message: "phone is invalid." })
    phone: string

    @IsEmail()
    @IsString()
    email: string

    @IsNotEmpty()
    @MaxLength(8, { message: "password cannot less than 8 character" })
    password: string

    @IsNotEmpty()
    @IsEnum(UserRole)
    role: UserRole
}