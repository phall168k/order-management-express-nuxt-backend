import { Types } from "mongoose";
import { NormalizedPagination } from "../../../../common/services/base-pagination.service";
import { CreateNotificationRequestDto } from "./dto/create-notification-request.dto";
import { UpdateNotificationRequestDto } from "./dto/update-notification-request.dto";
import { NotificationModel } from "./notification.model";

type CreateData = CreateNotificationRequestDto & { sender: string };
type SearchFilter = Record<string, unknown> & { $or?: Array<Record<string, unknown>> };

const populateRelations = [
    { path: "sender", select: "username email" },
    { path: "reciever", select: "username email" },
    { path: "notificationType", select: "name icon" },
];

const searchFilter = (query: NormalizedPagination, reciever?: string): SearchFilter => {
    const filter: SearchFilter = {};
    if (reciever) filter.reciever = reciever;
    if (query.search) {
        filter.$or = [
            { title: { $regex: query.search, $options: "i" } },
            { subject: { $regex: query.search, $options: "i" } },
            { link: { $regex: query.search, $options: "i" } },
        ];
    }
    return filter;
};

const findPaginated = async (query: NormalizedPagination, reciever?: string) => {
    const filter = searchFilter(query, reciever);
    const [data, total] = await Promise.all([
        NotificationModel.find(filter).populate(populateRelations).sort({ createdAt: -1 }).skip(query.skip).limit(query.limit),
        NotificationModel.countDocuments(filter),
    ]);
    return { data, total };
};

export const notificationRepository = {
    async create(data: CreateData) {
        const notification = await NotificationModel.create(data);
        return notification.populate(populateRelations);
    },
    findAll: (query: NormalizedPagination) => findPaginated(query),
    findReceived: (reciever: string, query: NormalizedPagination) => findPaginated(query, reciever),
    findById(id: string) {
        if (!Types.ObjectId.isValid(id)) return null;
        return NotificationModel.findById(id).populate(populateRelations);
    },
    update(id: string, data: UpdateNotificationRequestDto) {
        if (!Types.ObjectId.isValid(id)) return null;
        return NotificationModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate(populateRelations);
    },
    delete(id: string) {
        if (!Types.ObjectId.isValid(id)) return null;
        return NotificationModel.findByIdAndDelete(id).populate(populateRelations);
    },
};
