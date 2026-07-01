import { HttpException } from "../../../../common/exceptions/http.exception";
import { BasePaginationService, PaginationQueryDto } from "../../../../common/services/base-pagination.service";
import { UserModel } from "../user/user.model";
import { CreatePaymentMethodRequestDto } from "./dto/create-payment-method-request.dto";
import { UpdatePaymentMethodRequestDto } from "./dto/update-payment-method-request.dto";
import { paymentMethodRepository } from "./payment-method.repository";

const normalizeOptionalString = (value?: string) => {
    if (value === undefined) {
        return undefined;
    }

    const normalized = value.trim();

    return normalized || undefined;
};

const normalizePaymentMethodData = <T extends CreatePaymentMethodRequestDto | UpdatePaymentMethodRequestDto>(
    data: T,
) => ({
    logo: normalizeOptionalString(data.logo),
    bankAccount: normalizeOptionalString(data.bankAccount),
    merchantName: normalizeOptionalString(data.merchantName),
    merchantCity: normalizeOptionalString(data.merchantCity),
    amount: data.amount,
    currency: data.currency,
    storeLabel: normalizeOptionalString(data.storeLabel),
    phoneNumber: normalizeOptionalString(data.phoneNumber),
    billNumber: normalizeOptionalString(data.billNumber),
    terminalLabel: normalizeOptionalString(data.terminalLabel),
    isActive: data.isActive,
});

const validateCreatedByUser = async (userId: string) => {
    const user = await UserModel.exists({ _id: userId });

    if (!user) {
        throw new HttpException(404, "Created by user not found");
    }
};

export const paymentMethodService = {
    async create(data: CreatePaymentMethodRequestDto, createdByUser: string) {
        await validateCreatedByUser(createdByUser);

        return paymentMethodRepository.create({
            ...normalizePaymentMethodData(data),
            currency: data.currency,
            isActive: data.isActive ?? true,
            createdByUser,
        });
    },

    async findAll(query: PaginationQueryDto) {
        const pagination = BasePaginationService.normalize(query);
        const { data, total } = await paymentMethodRepository.findAll(pagination);

        return BasePaginationService.paginate(data, total, pagination);
    },

    async findById(id: string) {
        const paymentMethod = await paymentMethodRepository.findById(id);

        if (!paymentMethod) {
            throw new HttpException(404, "Payment method not found");
        }

        return paymentMethod;
    },

    async findSelectOptions() {
        const paymentMethods = await paymentMethodRepository.findSelectOptions();

        return paymentMethods.map((paymentMethod) => ({
            id: paymentMethod._id.toString(),
            logo: paymentMethod.logo,
            bankAccount: paymentMethod.bankAccount,
            merchantName: paymentMethod.merchantName,
            merchantCity: paymentMethod.merchantCity,
            amount: paymentMethod.amount,
            currency: paymentMethod.currency,
            storeLabel: paymentMethod.storeLabel,
            phoneNumber: paymentMethod.phoneNumber,
            billNumber: paymentMethod.billNumber,
            terminalLabel: paymentMethod.terminalLabel,
        }));
    },

    async update(id: string, data: UpdatePaymentMethodRequestDto) {
        const updateData: UpdatePaymentMethodRequestDto = {};
        const normalizedData = normalizePaymentMethodData(data);

        if (normalizedData.logo !== undefined) {
            updateData.logo = normalizedData.logo;
        }

        if (normalizedData.bankAccount !== undefined) {
            updateData.bankAccount = normalizedData.bankAccount;
        }

        if (normalizedData.merchantName !== undefined) {
            updateData.merchantName = normalizedData.merchantName;
        }

        if (normalizedData.merchantCity !== undefined) {
            updateData.merchantCity = normalizedData.merchantCity;
        }

        if (normalizedData.amount !== undefined) {
            updateData.amount = normalizedData.amount;
        }

        if (normalizedData.currency !== undefined) {
            updateData.currency = normalizedData.currency;
        }

        if (normalizedData.storeLabel !== undefined) {
            updateData.storeLabel = normalizedData.storeLabel;
        }

        if (normalizedData.phoneNumber !== undefined) {
            updateData.phoneNumber = normalizedData.phoneNumber;
        }

        if (normalizedData.billNumber !== undefined) {
            updateData.billNumber = normalizedData.billNumber;
        }

        if (normalizedData.terminalLabel !== undefined) {
            updateData.terminalLabel = normalizedData.terminalLabel;
        }

        if (normalizedData.isActive !== undefined) {
            updateData.isActive = normalizedData.isActive;
        }

        const paymentMethod = await paymentMethodRepository.update(id, updateData);

        if (!paymentMethod) {
            throw new HttpException(404, "Payment method not found");
        }

        return paymentMethod;
    },

    async delete(id: string) {
        const paymentMethod = await paymentMethodRepository.delete(id);

        if (!paymentMethod) {
            throw new HttpException(404, "Payment method not found");
        }

        return paymentMethod;
    },
};
