import { Types } from "mongoose";
import { CreateOrderRequestDto } from "./dto/create-order-request.dto";
import { UpdateOrderRequestDto } from "./dto/update-order-request.dto";
import { OrderModel } from "./order.model";

type OrderCreateData = CreateOrderRequestDto & {
    user: string;
};

const populateUser = {
    path: "user",
    select: "username email userProfile",
    populate: {
        path: "userProfile",
        select: "firstName lastName profile",
    },
};

const populateProduct = {
    path: "product",
    select: "code nameEn nameKh unitPrice discount thumbnail category",
    populate: {
        path: "category",
        select: "code nameEn nameKh icon",
    },
};

const populateOrder = [
    populateUser,
    populateProduct,
];

export const orderRepository = {
    async create(data: OrderCreateData) {
        const order = await OrderModel.create(data);

        return order.populate(populateOrder);
    },

    findByIdForUser(id: string, userId: string) {
        if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(userId)) {
            return null;
        }

        return OrderModel.findOne({
            _id: id,
            user: userId,
        }).populate(populateOrder);
    },

    findByUserAndProduct(userId: string, productId: string) {
        return OrderModel.findOne({
            user: userId,
            product: productId,
        });
    },

    findAllByUser(userId: string) {
        if (!Types.ObjectId.isValid(userId)) {
            return [];
        }

        return OrderModel.find({ user: userId })
            .populate(populateOrder)
            .sort({ createdAt: -1 });
    },

    updateForUser(id: string, userId: string, data: UpdateOrderRequestDto) {
        if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(userId)) {
            return null;
        }

        return OrderModel.findOneAndUpdate(
            {
                _id: id,
                user: userId,
            },
            data,
            {
                new: true,
                runValidators: true,
            },
        ).populate(populateOrder);
    },

    deleteForUser(id: string, userId: string) {
        if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(userId)) {
            return null;
        }

        return OrderModel.findOneAndDelete({
            _id: id,
            user: userId,
        }).populate(populateOrder);
    },
};
