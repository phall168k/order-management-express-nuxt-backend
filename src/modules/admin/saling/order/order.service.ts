import { Types } from "mongoose";
import { HttpException } from "../../../../common/exceptions/http.exception";
import { ProductModel } from "../../master-data/product/product.model";
import { UserModel } from "../../system/user/user.model";
import { CreateOrderRequestDto } from "./dto/create-order-request.dto";
import { UpdateOrderRequestDto } from "./dto/update-order-request.dto";
import { orderRepository } from "./order.repository";

const normalizeString = (value: string) => value.trim();

const validateUser = async (userId: string) => {
    if (!Types.ObjectId.isValid(userId)) {
        throw new HttpException(400, "Invalid user");
    }

    const user = await UserModel.exists({ _id: userId });

    if (!user) {
        throw new HttpException(404, "User not found");
    }
};

const validateProduct = async (productId: string) => {
    if (!Types.ObjectId.isValid(productId)) {
        throw new HttpException(400, "Invalid product");
    }

    const product = await ProductModel.exists({ _id: productId });

    if (!product) {
        throw new HttpException(404, "Product not found");
    }
};

export const orderService = {
    async create(data: CreateOrderRequestDto, userId: string) {
        await validateUser(userId);

        const product = normalizeString(data.product);
        await validateProduct(product);

        const existingOrder = await orderRepository.findByUserAndProduct(userId, product);

        if (existingOrder) {
            throw new HttpException(409, "Product is already picked");
        }

        return orderRepository.create({
            user: userId,
            product,
            quantity: data.quantity,
        });
    },

    findAllByUser(userId: string) {
        return orderRepository.findAllByUser(userId);
    },

    async findById(id: string, userId: string) {
        const order = await orderRepository.findByIdForUser(id, userId);

        if (!order) {
            throw new HttpException(404, "Order not found");
        }

        return order;
    },

    async update(id: string, data: UpdateOrderRequestDto, userId: string) {
        const updateData: UpdateOrderRequestDto = {};

        if (data.product !== undefined) {
            const product = normalizeString(data.product);
            await validateProduct(product);

            const existingOrder = await orderRepository.findByUserAndProduct(userId, product);

            if (existingOrder && existingOrder._id.toString() !== id) {
                throw new HttpException(409, "Product is already picked");
            }

            updateData.product = product;
        }

        if (data.quantity !== undefined) {
            updateData.quantity = data.quantity;
        }

        const order = await orderRepository.updateForUser(id, userId, updateData);

        if (!order) {
            throw new HttpException(404, "Order not found");
        }

        return order;
    },

    async delete(id: string, userId: string) {
        const order = await orderRepository.deleteForUser(id, userId);

        if (!order) {
            throw new HttpException(404, "Order not found");
        }

        return order;
    },
};
