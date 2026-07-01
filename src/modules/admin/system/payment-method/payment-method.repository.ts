import { Types } from "mongoose";
import { NormalizedPagination } from "../../../../common/services/base-pagination.service";
import { CreatePaymentMethodRequestDto } from "./dto/create-payment-method-request.dto";
import { UpdatePaymentMethodRequestDto } from "./dto/update-payment-method-request.dto";
import { PaymentMethodModel } from "./payment-method.model";

type PaymentMethodCreateData = CreatePaymentMethodRequestDto & {
    createdByUser: string;
};

type PaymentMethodSearchFilter = {
    $or?: Array<{
        bankAccount?: { $regex: string; $options: string };
        merchantName?: { $regex: string; $options: string };
        merchantCity?: { $regex: string; $options: string };
        storeLabel?: { $regex: string; $options: string };
        phoneNumber?: { $regex: string; $options: string };
        billNumber?: { $regex: string; $options: string };
        terminalLabel?: { $regex: string; $options: string };
    }>;
};

const populateCreatedByUser = {
    path: "createdByUser",
    select: "username email",
};

export const paymentMethodRepository = {
    async create(data: PaymentMethodCreateData) {
        const paymentMethod = await PaymentMethodModel.create(data);

        return paymentMethod.populate(populateCreatedByUser);
    },

    findById(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return PaymentMethodModel.findById(id).populate(populateCreatedByUser);
    },

    async findAll(query: NormalizedPagination) {
        const filter: PaymentMethodSearchFilter = {};

        if (query.search) {
            filter.$or = [
                { bankAccount: { $regex: query.search, $options: "i" } },
                { merchantName: { $regex: query.search, $options: "i" } },
                { merchantCity: { $regex: query.search, $options: "i" } },
                { storeLabel: { $regex: query.search, $options: "i" } },
                { phoneNumber: { $regex: query.search, $options: "i" } },
                { billNumber: { $regex: query.search, $options: "i" } },
                { terminalLabel: { $regex: query.search, $options: "i" } },
            ];
        }

        const [data, total] = await Promise.all([
            PaymentMethodModel.find(filter)
                .populate(populateCreatedByUser)
                .sort({ createdAt: -1 })
                .skip(query.skip)
                .limit(query.limit),
            PaymentMethodModel.countDocuments(filter),
        ]);

        return { data, total };
    },

    findSelectOptions() {
        return PaymentMethodModel.find({ isActive: true })
            .select("_id logo bankAccount merchantName merchantCity amount currency storeLabel phoneNumber billNumber terminalLabel")
            .sort({ merchantName: 1, bankAccount: 1 })
            .lean();
    },

    update(id: string, data: UpdatePaymentMethodRequestDto) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return PaymentMethodModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).populate(populateCreatedByUser);
    },

    delete(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return PaymentMethodModel.findByIdAndDelete(id).populate(populateCreatedByUser);
    },
};
