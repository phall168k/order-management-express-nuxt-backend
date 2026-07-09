import { Types } from "mongoose";
import { HttpException } from "../../../../common/exceptions/http.exception";
import { BasePaginationService, PaginationQueryDto } from "../../../../common/services/base-pagination.service";
import { UserModel } from "../user/user.model";
import { CreateUserProfileRequestDto } from "./dto/create-user-profile-request.dto";
import { UpdateUserProfileRequestDto } from "./dto/update-user-profile-request.dto";
import { UserProfileMinioObject } from "./user-profile.model";
import { userProfileRepository } from "./user-profile.repository";

const normalizeString = (value: string) => value.trim();

const normalizeOptionalString = (value?: string) => {
    if (value === undefined) {
        return undefined;
    }

    const normalized = value.trim();

    return normalized || undefined;
};

const normalizeOptionalDate = (value?: string | Date) => {
    if (value === undefined) {
        return undefined;
    }

    return value instanceof Date ? value : new Date(value);
};

const normalizeMinioObject = (value: UserProfileMinioObject): UserProfileMinioObject => ({
    bucket: normalizeString(value.bucket),
    objectName: normalizeString(value.objectName),
    originalName: normalizeOptionalString(value.originalName),
    mimeType: normalizeOptionalString(value.mimeType),
    size: value.size,
    etag: normalizeOptionalString(value.etag),
    url: normalizeString(value.url),
});

const validateCreatedByUser = async (userId?: string) => {
    if (userId === undefined) {
        return undefined;
    }

    const normalizedUserId = normalizeString(userId);

    if (!Types.ObjectId.isValid(normalizedUserId)) {
        throw new HttpException(400, "Invalid created by user");
    }

    const user = await UserModel.exists({ _id: normalizedUserId });

    if (!user) {
        throw new HttpException(404, "Created by user not found");
    }

    return normalizedUserId;
};

export const userProfileService = {
    async create(data: CreateUserProfileRequestDto) {
        const code = normalizeString(data.code);
        const existingUserProfile = await userProfileRepository.findByCode(code);

        if (existingUserProfile) {
            throw new HttpException(409, "User profile code already exists");
        }

        return userProfileRepository.create({
            code,
            userType: data.userType,
            firstName: normalizeString(data.firstName),
            lastName: normalizeString(data.lastName),
            gender: data.gender,
            dob: normalizeOptionalDate(data.dob),
            phoneNumber: normalizeOptionalString(data.phoneNumber),
            address: normalizeOptionalString(data.address),
            note: normalizeOptionalString(data.note),
            profile: data.profile ? normalizeMinioObject(data.profile) : undefined,
            createdByUser: await validateCreatedByUser(data.createdByUser),
        });
    },

    async findAll(query: PaginationQueryDto) {
        const pagination = BasePaginationService.normalize(query);
        const { data, total } = await userProfileRepository.findAll(pagination);

        return BasePaginationService.paginate(data, total, pagination);
    },

    async findById(id: string) {
        const userProfile = await userProfileRepository.findById(id);

        if (!userProfile) {
            throw new HttpException(404, "User profile not found");
        }

        return userProfile;
    },

    async findSelectOptions(mode?: unknown) {
        const normalizedMode = mode === "unmapped" ? "unmapped" : "all";

        return userProfileRepository.findSelectOptions(normalizedMode);
    },

    async update(id: string, data: UpdateUserProfileRequestDto) {
        const updateData: UpdateUserProfileRequestDto = {};

        if (data.code !== undefined) {
            const code = normalizeString(data.code);
            const existingUserProfile = await userProfileRepository.findByCodeExcludeId(code, id);

            if (existingUserProfile) {
                throw new HttpException(409, "User profile code already exists");
            }

            updateData.code = code;
        }

        if (data.userType !== undefined) {
            updateData.userType = data.userType;
        }

        if (data.firstName !== undefined) {
            updateData.firstName = normalizeString(data.firstName);
        }

        if (data.lastName !== undefined) {
            updateData.lastName = normalizeString(data.lastName);
        }

        if (data.gender !== undefined) {
            updateData.gender = data.gender;
        }

        if (data.dob !== undefined) {
            updateData.dob = normalizeOptionalDate(data.dob);
        }

        if (data.phoneNumber !== undefined) {
            updateData.phoneNumber = normalizeOptionalString(data.phoneNumber);
        }

        if (data.address !== undefined) {
            updateData.address = normalizeOptionalString(data.address);
        }

        if (data.note !== undefined) {
            updateData.note = normalizeOptionalString(data.note);
        }

        if (data.profile !== undefined) {
            updateData.profile = normalizeMinioObject(data.profile);
        }

        if (data.createdByUser !== undefined) {
            updateData.createdByUser = await validateCreatedByUser(data.createdByUser);
        }

        const userProfile = await userProfileRepository.update(id, updateData);

        if (!userProfile) {
            throw new HttpException(404, "User profile not found");
        }

        return userProfile;
    },

    async delete(id: string) {
        const userProfile = await userProfileRepository.delete(id);

        if (!userProfile) {
            throw new HttpException(404, "User profile not found");
        }

        return userProfile;
    },
};
