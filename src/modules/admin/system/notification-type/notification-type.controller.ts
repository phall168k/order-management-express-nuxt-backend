import { Request, Response } from "express";
import { HttpException } from "../../../../common/exceptions/http.exception";
import { PaginationQueryDto } from "../../../../common/services/base-pagination.service";
import { CreateNotificationTypeRequestDto } from "./dto/create-notification-type-request.dto";
import { UpdateNotificationTypeRequestDto } from "./dto/update-notification-type-request.dto";
import { notificationTypeService } from "./notification-type.service";

const getIdParam = (req: Request) => Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
const getAuthUserId = (userId?: string) => {
    if (!userId) throw new HttpException(401, "Unauthorized");
    return userId;
};

export const notificationTypeController = {
    async create(req: Request<object, object, CreateNotificationTypeRequestDto>, res: Response) {
        const data = await notificationTypeService.create(req.body, getAuthUserId(req.user?._id));
        return res.status(201).json({ success: true, message: "Notification type created successfully", data });
    },

    async findAll(req: Request<object, object, object, PaginationQueryDto>, res: Response) {
        const result = await notificationTypeService.findAll(req.query);
        return res.status(200).json({ success: true, message: "Notification types fetched successfully", ...result });
    },

    async findById(req: Request, res: Response) {
        const data = await notificationTypeService.findById(getIdParam(req));
        return res.status(200).json({ success: true, message: "Notification type fetched successfully", data });
    },

    async findSelectOptions(_req: Request, res: Response) {
        const data = await notificationTypeService.findSelectOptions();
        return res.status(200).json({ success: true, message: "Notification type select options fetched successfully", data });
    },

    async update(req: Request<{ id: string }, object, UpdateNotificationTypeRequestDto>, res: Response) {
        const data = await notificationTypeService.update(getIdParam(req), req.body);
        return res.status(200).json({ success: true, message: "Notification type updated successfully", data });
    },

    async delete(req: Request, res: Response) {
        const data = await notificationTypeService.delete(getIdParam(req));
        return res.status(200).json({ success: true, message: "Notification type deleted successfully", data });
    },
};
