import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

export function createSessionSwagger() {
    return applyDecorators(
        ApiOperation({ summary: "create payment session" }),
        ApiResponse({
            status: 201, description: "payment session created", schema: {
                type: "object",
                properties: {
                    url: { type: "string" },
                }
            }
        }),
        ApiResponse({ status: 400, description: "bad request" }),
        ApiResponse({ status: 500, description: "internal server error" }),
    )
}