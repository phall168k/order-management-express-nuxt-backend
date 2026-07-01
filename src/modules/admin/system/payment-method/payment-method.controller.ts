import { Request, Response } from "express";
import { HttpException } from "../../../../common/exceptions/http.exception";
import { PaginationQueryDto } from "../../../../common/services/base-pagination.service";
import { CreatePaymentMethodRequestDto } from "./dto/create-payment-method-request.dto";
import { UpdatePaymentMethodRequestDto } from "./dto/update-payment-method-request.dto";
import { paymentMethodService } from "./payment-method.service";

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

export const paymentMethodController = {
    async create(req: Request<object, object, CreatePaymentMethodRequestDto>, res: Response) {
        const paymentMethod = await paymentMethodService.create(req.body, getAuthUserId(req.user?._id));

        return res.status(201).json({
            success: true,
            message: "Payment method created successfully",
            data: paymentMethod,
        });
    },

    async findAll(req: Request<object, object, object, PaginationQueryDto>, res: Response) {
        const paymentMethods = await paymentMethodService.findAll(req.query);

        return res.status(200).json({
            success: true,
            message: "Payment methods fetched successfully",
            ...paymentMethods,
        });
    },

    async findById(req: Request, res: Response) {
        const paymentMethod = await paymentMethodService.findById(getIdParam(req));

        return res.status(200).json({
            success: true,
            message: "Payment method fetched successfully",
            data: paymentMethod,
        });
    },

    async findSelectOptions(_req: Request, res: Response) {
        const paymentMethods = await paymentMethodService.findSelectOptions();

        return res.status(200).json({
            success: true,
            message: "Payment method select options fetched successfully",
            data: paymentMethods,
        });
    },

    async update(req: Request<{ id: string }, object, UpdatePaymentMethodRequestDto>, res: Response) {
        const paymentMethod = await paymentMethodService.update(getIdParam(req), req.body);

        return res.status(200).json({
            success: true,
            message: "Payment method updated successfully",
            data: paymentMethod,
        });
    },

    async delete(req: Request, res: Response) {
        const paymentMethod = await paymentMethodService.delete(getIdParam(req));

        return res.status(200).json({
            success: true,
            message: "Payment method deleted successfully",
            data: paymentMethod,
        });
    },
};
