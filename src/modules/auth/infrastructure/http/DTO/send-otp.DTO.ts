import { IsNotEmpty, IsPhoneNumber } from "class-validator";

export class SendOtpDTO {
    @IsNotEmpty()
    @IsPhoneNumber("IR", { message: "phone is invalid." })
    phone: string;
}