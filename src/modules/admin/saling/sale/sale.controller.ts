import { Request, Response } from "express";
import { HttpException } from "../../../../common/exceptions/http.exception";
import { PaginationQueryDto } from "../../../../common/services/base-pagination.service";
import { CreateSaleRequestDto } from "./dto/create-sale-request.dto";
import { UpdateSaleRequestDto } from "./dto/update-sale-request.dto";
import { saleService } from "./sale.service";

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

export const saleController = {
    async create(req: Request<object, object, CreateSaleRequestDto>, res: Response) {
        const sale = await saleService.create(req.body, getAuthUserId(req.user?._id));

        return res.status(201).json({
            success: true,
            message: "Sale created successfully",
            data: sale,
        });
    },

    async findAll(req: Request<object, object, object, PaginationQueryDto>, res: Response) {
        const sales = await saleService.findAll(req.query);

        return res.status(200).json({
            success: true,
            message: "Sales fetched successfully",
            ...sales,
        });
    },

    async findById(req: Request, res: Response) {
        const sale = await saleService.findById(getIdParam(req));

        return res.status(200).json({
            success: true,
            message: "Sale fetched successfully",
            data: sale,
        });
    },

    async update(req: Request<{ id: string }, object, UpdateSaleRequestDto>, res: Response) {
        const sale = await saleService.update(getIdParam(req), req.body);

        return res.status(200).json({
            success: true,
            message: "Sale updated successfully",
            data: sale,
        });
    },

    async delete(req: Request, res: Response) {
        const sale = await saleService.delete(getIdParam(req));

        return res.status(200).json({
            success: true,
            message: "Sale deleted successfully",
            data: sale,
        });
    },
};
