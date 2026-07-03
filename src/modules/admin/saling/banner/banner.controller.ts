import { Request, Response } from "express";
import { HttpException } from "../../../../common/exceptions/http.exception";
import { PaginationQueryDto } from "../../../../common/services/base-pagination.service";
import { bannerService } from "./banner.service";
import { CreateBannerRequestDto } from "./dto/create-banner-request.dto";
import { UpdateBannerRequestDto } from "./dto/update-banner-request.dto";

const getIdParam = (req: Request) => {
    const id = req.params.id;

    return Array.isArray(id) ? id[0] : id;
};

const getAuthUserId = (userId?: string) => {
    if (!userId) {
        throw new HttpException(401, "Unauthorized");
    }

    return userId;
};

export const bannerController = {
    async create(req: Request<object, object, CreateBannerRequestDto>, res: Response) {
        const banner = await bannerService.create(req.body, getAuthUserId(req.user?._id));

        return res.status(201).json({
            success: true,
            message: "Banner created successfully",
            data: banner,
        });
    },

    async findAll(req: Request<object, object, object, PaginationQueryDto>, res: Response) {
        const banners = await bannerService.findAll(req.query);

        return res.status(200).json({
            success: true,
            message: "Banners fetched successfully",
            ...banners,
        });
    },

    async findById(req: Request, res: Response) {
        const banner = await bannerService.findById(getIdParam(req));

        return res.status(200).json({
            success: true,
            message: "Banner fetched successfully",
            data: banner,
        });
    },

    async findSelectOptions(_req: Request, res: Response) {
        const banners = await bannerService.findSelectOptions();

        return res.status(200).json({
            success: true,
            message: "Banner select options fetched successfully",
            data: banners,
        });
    },

    async update(req: Request<{ id: string }, object, UpdateBannerRequestDto>, res: Response) {
        const banner = await bannerService.update(getIdParam(req), req.body);

        return res.status(200).json({
            success: true,
            message: "Banner updated successfully",
            data: banner,
        });
    },

    async delete(req: Request, res: Response) {
        const banner = await bannerService.delete(getIdParam(req));

        return res.status(200).json({
            success: true,
            message: "Banner deleted successfully",
            data: banner,
        });
    },
};
