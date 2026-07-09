import { Request, Response } from "express";
import { HttpException } from "../../../../common/exceptions/http.exception";
import { CreateOrderRequestDto } from "./dto/create-order-request.dto";
import { UpdateOrderRequestDto } from "./dto/update-order-request.dto";
import { orderService } from "./order.service";

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

export const orderController = {
    async create(req: Request<object, object, CreateOrderRequestDto>, res: Response) {
        const order = await orderService.create(req.body, getAuthUserId(req.user?._id));

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order,
        });
    },

    async findMyProducts(req: Request, res: Response) {
        const orders = await orderService.findAllByUser(getAuthUserId(req.user?._id));

        return res.status(200).json({
            success: true,
            message: "Picked products fetched successfully",
            data: orders,
        });
    },

    async findById(req: Request, res: Response) {
        const order = await orderService.findById(getIdParam(req), getAuthUserId(req.user?._id));

        return res.status(200).json({
            success: true,
            message: "Order fetched successfully",
            data: order,
        });
    },

    async update(req: Request<{ id: string }, object, UpdateOrderRequestDto>, res: Response) {
        const order = await orderService.update(getIdParam(req), req.body, getAuthUserId(req.user?._id));

        return res.status(200).json({
            success: true,
            message: "Order updated successfully",
            data: order,
        });
    },

    async delete(req: Request, res: Response) {
        const order = await orderService.delete(getIdParam(req), getAuthUserId(req.user?._id));

        return res.status(200).json({
            success: true,
            message: "Order deleted successfully",
            data: order,
        });
    },
};
