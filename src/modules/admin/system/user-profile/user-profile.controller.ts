import { Request, Response } from "express";
import { PaginationQueryDto } from "../../../../common/services/base-pagination.service";
import { CreateUserProfileRequestDto } from "./dto/create-user-profile-request.dto";
import { UpdateUserProfileRequestDto } from "./dto/update-user-profile-request.dto";
import { userProfileService } from "./user-profile.service";

const getIdParam = (req: Request) => {
    const id = req.params.id;

    return Array.isArray(id) ? id[0] : id;
};

export const userProfileController = {
    async create(req: Request<object, object, CreateUserProfileRequestDto>, res: Response) {
        const userProfile = await userProfileService.create(req.body);

        return res.status(201).json({
            success: true,
            message: "User profile created successfully",
            data: userProfile,
        });
    },

    async findAll(req: Request<object, object, object, PaginationQueryDto>, res: Response) {
        const userProfiles = await userProfileService.findAll(req.query);

        return res.status(200).json({
            success: true,
            message: "User profiles fetched successfully",
            ...userProfiles,
        });
    },

    async findById(req: Request, res: Response) {
        const userProfile = await userProfileService.findById(getIdParam(req));

        return res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            data: userProfile,
        });
    },

    async findSelectOptions(req: Request<object, object, object, { mode?: string }>, res: Response) {
        const userProfiles = await userProfileService.findSelectOptions(req.query.mode);

        return res.status(200).json({
            success: true,
            message: "User profile select options fetched successfully",
            data: userProfiles,
        });
    },

    async update(req: Request<{ id: string }, object, UpdateUserProfileRequestDto>, res: Response) {
        const userProfile = await userProfileService.update(getIdParam(req), req.body);

        return res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            data: userProfile,
        });
    },

    async delete(req: Request, res: Response) {
        const userProfile = await userProfileService.delete(getIdParam(req));

        return res.status(200).json({
            success: true,
            message: "User profile deleted successfully",
            data: userProfile,
        });
    },
};
