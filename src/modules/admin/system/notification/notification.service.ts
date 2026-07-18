import { Types } from "mongoose";
import { HttpException } from "../../../../common/exceptions/http.exception";
import { BasePaginationService, PaginationQueryDto } from "../../../../common/services/base-pagination.service";
import { NotificationTypeModel } from "../notification-type/notification-type.model";
import { UserModel } from "../user/user.model";
import { CreateNotificationRequestDto } from "./dto/create-notification-request.dto";
import { UpdateNotificationRequestDto } from "./dto/update-notification-request.dto";
import { notificationRepository } from "./notification.repository";

const normalizeString = (value: string) => value.trim();
const validateUser = async (id: string, label: string) => {
    if (!Types.ObjectId.isValid(id) || !await UserModel.exists({ _id: id })) {
        throw new HttpException(404, `${label} user not found`);
    }
};
const validateNotificationType = async (id: string) => {
    if (!Types.ObjectId.isValid(id) || !await NotificationTypeModel.exists({ _id: id })) {
        throw new HttpException(404, "Notification type not found");
    }
};

export const notificationService = {
    async create(data: CreateNotificationRequestDto, sender: string) {
        await Promise.all([
            validateUser(sender, "Sender"),
            validateUser(data.reciever, "Reciever"),
            validateNotificationType(data.notificationType),
        ]);
        return notificationRepository.create({
            title: normalizeString(data.title),
            subject: normalizeString(data.subject),
            sender,
            reciever: data.reciever,
            notificationType: data.notificationType,
            link: normalizeString(data.link),
            isSeen: data.isSeen ?? false,
        });
    },
    async findAll(query: PaginationQueryDto) {
        const pagination = BasePaginationService.normalize(query);
        const { data, total } = await notificationRepository.findAll(pagination);
        return BasePaginationService.paginate(data, total, pagination);
    },
    async findReceived(userId: string, query: PaginationQueryDto) {
        const pagination = BasePaginationService.normalize(query);
        const { data, total } = await notificationRepository.findReceived(userId, pagination);
        return BasePaginationService.paginate(data, total, pagination);
    },
    async findById(id: string) {
        const result = await notificationRepository.findById(id);
        if (!result) throw new HttpException(404, "Notification not found");
        return result;
    },
    async update(id: string, data: UpdateNotificationRequestDto) {
        const updateData: UpdateNotificationRequestDto = {};
        if (data.title !== undefined) updateData.title = normalizeString(data.title);
        if (data.subject !== undefined) updateData.subject = normalizeString(data.subject);
        if (data.link !== undefined) updateData.link = normalizeString(data.link);
        if (data.isSeen !== undefined) updateData.isSeen = data.isSeen;
        if (data.reciever !== undefined) {
            await validateUser(data.reciever, "Reciever");
            updateData.reciever = data.reciever;
        }
        if (data.notificationType !== undefined) {
            await validateNotificationType(data.notificationType);
            updateData.notificationType = data.notificationType;
        }
        const result = await notificationRepository.update(id, updateData);
        if (!result) throw new HttpException(404, "Notification not found");
        return result;
    },
    async delete(id: string) {
        const result = await notificationRepository.delete(id);
        if (!result) throw new HttpException(404, "Notification not found");
        return result;
    },
};
