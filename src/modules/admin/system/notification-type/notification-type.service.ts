import { HttpException } from "../../../../common/exceptions/http.exception";
import { BasePaginationService, PaginationQueryDto } from "../../../../common/services/base-pagination.service";
import { UserModel } from "../user/user.model";
import { CreateNotificationTypeRequestDto } from "./dto/create-notification-type-request.dto";
import { UpdateNotificationTypeRequestDto } from "./dto/update-notification-type-request.dto";
import { notificationTypeRepository } from "./notification-type.repository";

const normalizeString = (value: string) => value.trim();

export const notificationTypeService = {
    async create(data: CreateNotificationTypeRequestDto, createdByUser: string) {
        if (!await UserModel.exists({ _id: createdByUser })) {
            throw new HttpException(404, "Created by user not found");
        }

        const name = normalizeString(data.name);
        if (await notificationTypeRepository.findByName(name)) {
            throw new HttpException(409, "Notification type name already exists");
        }

        return notificationTypeRepository.create({
            name,
            icon: normalizeString(data.icon),
            createdByUser,
        });
    },

    async findAll(query: PaginationQueryDto) {
        const pagination = BasePaginationService.normalize(query);
        const { data, total } = await notificationTypeRepository.findAll(pagination);
        return BasePaginationService.paginate(data, total, pagination);
    },

    async findById(id: string) {
        const notificationType = await notificationTypeRepository.findById(id);
        if (!notificationType) throw new HttpException(404, "Notification type not found");
        return notificationType;
    },

    async findSelectOptions() {
        const notificationTypes = await notificationTypeRepository.findSelectOptions();
        return notificationTypes.map(({ _id, name, icon }) => ({
            id: _id.toString(),
            name,
            icon,
        }));
    },

    async update(id: string, data: UpdateNotificationTypeRequestDto) {
        const updateData: UpdateNotificationTypeRequestDto = {};
        if (data.name !== undefined) {
            const name = normalizeString(data.name);
            if (await notificationTypeRepository.findByNameExcludeId(name, id)) {
                throw new HttpException(409, "Notification type name already exists");
            }
            updateData.name = name;
        }
        if (data.icon !== undefined) updateData.icon = normalizeString(data.icon);

        const notificationType = await notificationTypeRepository.update(id, updateData);
        if (!notificationType) throw new HttpException(404, "Notification type not found");
        return notificationType;
    },

    async delete(id: string) {
        const notificationType = await notificationTypeRepository.delete(id);
        if (!notificationType) throw new HttpException(404, "Notification type not found");
        return notificationType;
    },
};
