import { Types } from "mongoose";
import { NormalizedPagination } from "../../../../common/services/base-pagination.service";
import { CreateNotificationTypeRequestDto } from "./dto/create-notification-type-request.dto";
import { UpdateNotificationTypeRequestDto } from "./dto/update-notification-type-request.dto";
import { NotificationTypeModel } from "./notification-type.model";

type NotificationTypeCreateData = CreateNotificationTypeRequestDto & {
    createdByUser: string;
};

const populateCreatedByUser = {
    path: "createdByUser",
    select: "username email",
};

export const notificationTypeRepository = {
    async create(data: NotificationTypeCreateData) {
        const notificationType = await NotificationTypeModel.create(data);
        return notificationType.populate(populateCreatedByUser);
    },

    findById(id: string) {
        if (!Types.ObjectId.isValid(id)) return null;
        return NotificationTypeModel.findById(id).populate(populateCreatedByUser);
    },

    findByName(name: string) {
        return NotificationTypeModel.findOne({ name });
    },

    findByNameExcludeId(name: string, id: string) {
        return NotificationTypeModel.findOne({ _id: { $ne: id }, name });
    },

    async findAll(query: NormalizedPagination) {
        const filter = query.search
            ? { $or: [
                { name: { $regex: query.search, $options: "i" } },
                { icon: { $regex: query.search, $options: "i" } },
            ] }
            : {};
        const [data, total] = await Promise.all([
            NotificationTypeModel.find(filter)
                .populate(populateCreatedByUser)
                .sort({ createdAt: -1 })
                .skip(query.skip)
                .limit(query.limit),
            NotificationTypeModel.countDocuments(filter),
        ]);
        return { data, total };
    },

    findSelectOptions() {
        return NotificationTypeModel.find().select("_id name icon").sort({ name: 1 }).lean();
    },

    update(id: string, data: UpdateNotificationTypeRequestDto) {
        if (!Types.ObjectId.isValid(id)) return null;
        return NotificationTypeModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).populate(populateCreatedByUser);
    },

    delete(id: string) {
        if (!Types.ObjectId.isValid(id)) return null;
        return NotificationTypeModel.findByIdAndDelete(id).populate(populateCreatedByUser);
    },
};
