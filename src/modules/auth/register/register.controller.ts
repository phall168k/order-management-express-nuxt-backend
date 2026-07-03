import { Request, Response } from "express";
import { RegisterRequestDto } from "./dto/register-request.dto";
import { registerService } from "./register.service";

export const registerController = {
    async register(req: Request<object, object, RegisterRequestDto>, res: Response) {
        const registerData = await registerService.register(req.body);

        return res.status(201).json({
            success: true,
            message: "Register successfully",
            data: registerData.user,
            token: registerData.token,
        });
    },
};
