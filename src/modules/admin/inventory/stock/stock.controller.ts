import { Request, Response } from "express";
import { HttpException } from "../../../../common/exceptions/http.exception";
import { PaginationQueryDto } from "../../../../common/services/base-pagination.service";
import { CreateStockRequestDto } from "./dto/create-stock-request.dto";
import { UpdateStockRequestDto } from "./dto/update-stock-request.dto";
import { stockService } from "./stock.service";

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

export const stockController = {
    async create(req: Request<object, object, CreateStockRequestDto>, res: Response) {
        const stock = await stockService.create(req.body, getAuthUserId(req.user?._id));

        return res.status(201).json({
            success: true,
            message: "Stock created successfully",
            data: stock,
        });
    },

    async findAll(req: Request<object, object, object, PaginationQueryDto>, res: Response) {
        const stocks = await stockService.findAll(req.query);

        return res.status(200).json({
            success: true,
            message: "Stocks fetched successfully",
            ...stocks,
        });
    },

    async findById(req: Request, res: Response) {
        const stock = await stockService.findById(getIdParam(req));

        return res.status(200).json({
            success: true,
            message: "Stock fetched successfully",
            data: stock,
        });
    },

    async update(req: Request<{ id: string }, object, UpdateStockRequestDto>, res: Response) {
        const stock = await stockService.update(getIdParam(req), req.body);

        return res.status(200).json({
            success: true,
            message: "Stock updated successfully",
            data: stock,
        });
    },

    async delete(req: Request, res: Response) {
        const stock = await stockService.delete(getIdParam(req));

        return res.status(200).json({
            success: true,
            message: "Stock deleted successfully",
            data: stock,
        });
    },
};
