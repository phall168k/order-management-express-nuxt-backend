import { Request, Response } from "express";
import { HttpException } from "../../../../common/exceptions/http.exception";
import { PaginationQueryDto } from "../../../../common/services/base-pagination.service";
import { CreateNotificationRequestDto } from "./dto/create-notification-request.dto";
import { UpdateNotificationRequestDto } from "./dto/update-notification-request.dto";
import { notificationService } from "./notification.service";

const getId = (req: Request) => Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
const authUserId = (userId?: string) => {
    if (!userId) throw new HttpException(401, "Unauthorized");
    return userId;
};

export const notificationController = {
    async create(req: Request<object, object, CreateNotificationRequestDto>, res: Response) {
        const data = await notificationService.create(req.body, authUserId(req.user?._id));
        return res.status(201).json({ success: true, message: "Notification created successfully", data });
    },
    async findAll(req: Request<object, object, object, PaginationQueryDto>, res: Response) {
        const result = await notificationService.findAll(req.query);
        return res.status(200).json({ success: true, message: "Notifications fetched successfully", ...result });
    },
    async findReceived(req: Request<object, object, object, PaginationQueryDto>, res: Response) {
        const result = await notificationService.findReceived(authUserId(req.user?._id), req.query);
        return res.status(200).json({ success: true, message: "Received notifications fetched successfully", ...result });
    },
    async findById(req: Request, res: Response) {
        const data = await notificationService.findById(getId(req));
        return res.status(200).json({ success: true, message: "Notification fetched successfully", data });
    },
    async update(req: Request<{ id: string }, object, UpdateNotificationRequestDto>, res: Response) {
        const data = await notificationService.update(getId(req), req.body);
        return res.status(200).json({ success: true, message: "Notification updated successfully", data });
    },
    async delete(req: Request, res: Response) {
        const data = await notificationService.delete(getId(req));
        return res.status(200).json({ success: true, message: "Notification deleted successfully", data });
    },
};
