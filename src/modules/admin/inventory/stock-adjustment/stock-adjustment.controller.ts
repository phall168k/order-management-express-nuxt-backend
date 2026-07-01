import { Request, Response } from "express";
import { HttpException } from "../../../../common/exceptions/http.exception";
import { PaginationQueryDto } from "../../../../common/services/base-pagination.service";
import { CreateStockAdjustmentRequestDto } from "./dto/create-stock-adjustment-request.dto";
import { UpdateStockAdjustmentRequestDto } from "./dto/update-stock-adjustment-request.dto";
import { stockAdjustmentService } from "./stock-adjustment.service";

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

export const stockAdjustmentController = {
    async create(req: Request<object, object, CreateStockAdjustmentRequestDto>, res: Response) {
        const stockAdjustments = await stockAdjustmentService.create(req.body, getAuthUserId(req.user?._id));

        return res.status(201).json({
            success: true,
            message: "Stock adjustment created successfully",
            data: stockAdjustments,
        });
    },

    async findAll(req: Request<object, object, object, PaginationQueryDto>, res: Response) {
        const stockAdjustments = await stockAdjustmentService.findAll(req.query);

        return res.status(200).json({
            success: true,
            message: "Stock adjustments fetched successfully",
            ...stockAdjustments,
        });
    },

    async findById(req: Request, res: Response) {
        const stockAdjustment = await stockAdjustmentService.findById(getIdParam(req));

        return res.status(200).json({
            success: true,
            message: "Stock adjustment fetched successfully",
            data: stockAdjustment,
        });
    },

    async update(req: Request<{ id: string }, object, UpdateStockAdjustmentRequestDto>, res: Response) {
        const stockAdjustment = await stockAdjustmentService.update(getIdParam(req), req.body);

        return res.status(200).json({
            success: true,
            message: "Stock adjustment updated successfully",
            data: stockAdjustment,
        });
    },

    async delete(req: Request, res: Response) {
        const stockAdjustment = await stockAdjustmentService.delete(getIdParam(req));

        return res.status(200).json({
            success: true,
            message: "Stock adjustment deleted successfully",
            data: stockAdjustment,
        });
    },
};
