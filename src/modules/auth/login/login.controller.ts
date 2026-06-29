import { Request, Response } from "express";
import { LoginRequestDto } from "./dto/login-request.dto";
import { loginService } from "./login.service";

export const loginController = {
    async login(req: Request<object, object, LoginRequestDto>, res: Response) {
        const loginData = await loginService.login(req.body);

        return res.status(200).json({
            success: true,
            message: "Login successfully",
            data: loginData.user,
            token: loginData.token,
        });
    },
};
