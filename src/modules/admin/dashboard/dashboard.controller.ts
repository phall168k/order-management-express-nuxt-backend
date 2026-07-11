import { Request, Response } from "express";
import { HttpException } from "../../../common/exceptions/http.exception";
import { dashboardService } from "./dashboard.service";

type DashboardQuery = { year?: string };

export const dashboardController = {
    async getDashboard(req: Request<object, object, object, DashboardQuery>, res: Response) {
        const currentYear = new Date().getUTCFullYear();
        const year = req.query.year === undefined ? currentYear : Number(req.query.year);

        if (!Number.isInteger(year) || year < 1970 || year > 9999) {
            throw new HttpException(400, "Year must be an integer between 1970 and 9999");
        }

        const dashboard = await dashboardService.getDashboard(year);

        return res.status(200).json({
            success: true,
            message: "Dashboard fetched successfully",
            data: {
                year,
                ...dashboard,
            },
        });
    },
};
