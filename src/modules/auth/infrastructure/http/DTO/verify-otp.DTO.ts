import { IsNotEmpty, IsPhoneNumber } from "class-validator";

export class VerifyOtpDTO {
    @IsNotEmpty()
    @IsPhoneNumber("IR", { message: "phone is invalid." })
    phone: string;

    @IsNotEmpty()
    code: string
}