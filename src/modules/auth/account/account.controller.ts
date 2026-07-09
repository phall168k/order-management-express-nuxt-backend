import { Request, Response } from "express";
import { HttpException } from "../../../common/exceptions/http.exception";
import { accountService } from "./account.service";
import { ChangePasswordRequestDto } from "./dto/change-password-request.dto";
import { UpdateAccountRequestDto } from "./dto/update-account-request.dto";

const getAuthUserId = (userId?: string) => {
    if (!userId) {
        throw new HttpException(401, "Unauthorized");
    }

    return userId;
};

export const accountController = {
    async changePassword(req: Request<object, object, ChangePasswordRequestDto>, res: Response) {
        const accountData = await accountService.changePassword(getAuthUserId(req.user?._id), req.body);

        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
            data: accountData.user,
            token: accountData.token,
        });
    },

    async updateAccount(req: Request<object, object, UpdateAccountRequestDto>, res: Response) {
        const accountData = await accountService.updateAccount(getAuthUserId(req.user?._id), req.body);

        return res.status(200).json({
            success: true,
            message: "Account updated successfully",
            data: accountData.user,
            token: accountData.token,
        });
    },

    async logout(_req: Request, res: Response) {
        const logoutData = accountService.logout();

        return res.status(200).json({
            success: true,
            message: logoutData.message,
        });
    },
};
