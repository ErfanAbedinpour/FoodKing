import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { CreateUserDTO } from "./DTO/auth.DTO";
import { SendOtpDTO } from "./DTO/send-otp.DTO";
import { VerifyOtpDTO } from "./DTO/verify-otp.DTO";
import { GenerateTokenDTO } from "./DTO/generate-token.DTO";

export function signupSwagger() {
    return applyDecorators(
        ApiCreatedResponse({
            description: 'user Created successfully',
            schema: { type: 'object', properties: { msg: { type: 'string' } } },
        }),
        ApiBody({ type: CreateUserDTO }),
        ApiBadRequestResponse({ description: 'BadRequest Exception' })
    )
}

export function signinSwagger(){
    return applyDecorators(
        ApiOkResponse({
            description: 'OTP Sended successfully',
            schema: { type: 'object', properties: { msg: { type: 'string' } } },
        }),
        ApiBody({ type: SendOtpDTO }),
        ApiBadRequestResponse({ description: 'BadRequest Exception' })
    )
}

export function verifySwagger(){
    return applyDecorators(
        ApiBody({type:VerifyOtpDTO}),
        ApiOkResponse({
            description: 'user verified successfully',
            schema: {
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' },
              },
            },
          }),
          ApiBadRequestResponse({ description: 'BadRequest Exception' }) 
    )
}


export function generateTokenSwagger(){
    return applyDecorators(
        ApiBody({type:GenerateTokenDTO}),
        ApiOkResponse({
            description: 'token generated successfully',
            schema: {
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' },
              },
            },
          }),
          ApiUnauthorizedResponse({ description: 'token is invalid' }) 
    )
}