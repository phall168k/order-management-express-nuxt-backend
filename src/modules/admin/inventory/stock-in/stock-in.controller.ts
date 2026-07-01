import { Request, Response } from "express";
import { HttpException } from "../../../../common/exceptions/http.exception";
import { PaginationQueryDto } from "../../../../common/services/base-pagination.service";
import { CreateStockInRequestDto } from "./dto/create-stock-in-request.dto";
import { UpdateStockInRequestDto } from "./dto/update-stock-in-request.dto";
import { stockInService } from "./stock-in.service";

const getIdParam = (req: Request) => {
    const id = req.params.id;

    return Array.isArray(id) ? id[0] : id;
};

const getAuthUserId = (userId?: string) => {
    if (!userId) {
        throw new HttpException(401, "Unauthorized");
    }

    return userId;
};

export const stockInController = {
    async create(req: Request<object, object, CreateStockInRequestDto>, res: Response) {
        const stockIns = await stockInService.create(req.body, getAuthUserId(req.user?._id));

        return res.status(201).json({
            success: true,
            message: "Stock in created successfully",
            data: stockIns,
        });
    },

    async findAll(req: Request<object, object, object, PaginationQueryDto>, res: Response) {
        const stockIns = await stockInService.findAll(req.query);

        return res.status(200).json({
            success: true,
            message: "Stock in fetched successfully",
            ...stockIns,
        });
    },

    async findById(req: Request, res: Response) {
        const stockIn = await stockInService.findById(getIdParam(req));

        return res.status(200).json({
            success: true,
            message: "Stock in fetched successfully",
            data: stockIn,
        });
    },

    async update(req: Request<{ id: string }, object, UpdateStockInRequestDto>, res: Response) {
        const stockIn = await stockInService.update(getIdParam(req), req.body);

        return res.status(200).json({
            success: true,
            message: "Stock in updated successfully",
            data: stockIn,
        });
    },

    async delete(req: Request, res: Response) {
        const stockIn = await stockInService.delete(getIdParam(req));

        return res.status(200).json({
            success: true,
            message: "Stock in deleted successfully",
            data: stockIn,
        });
    },
};
