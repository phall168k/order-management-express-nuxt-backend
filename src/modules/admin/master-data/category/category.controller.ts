import { Request, Response } from "express";
import { HttpException } from "../../../../common/exceptions/http.exception";
import { PaginationQueryDto } from "../../../../common/services/base-pagination.service";
import { categoryService } from "./category.service";
import { CreateCategoryRequestDto } from "./dto/create-category-request.dto";
import { UpdateCategoryRequestDto } from "./dto/update-category-request.dto";

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

export const categoryController = {
    async create(req: Request<object, object, CreateCategoryRequestDto>, res: Response) {
        const category = await categoryService.create(req.body, getAuthUserId(req.user?._id));

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });
    },

    async findAll(req: Request<object, object, object, PaginationQueryDto>, res: Response) {
        const categories = await categoryService.findAll(req.query);

        return res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            ...categories,
        });
    },

    async findById(req: Request, res: Response) {
        const category = await categoryService.findById(getIdParam(req));

        return res.status(200).json({
            success: true,
            message: "Category fetched successfully",
            data: category,
        });
    },

    async findSelectOptions(_req: Request, res: Response) {
        const categories = await categoryService.findSelectOptions();

        return res.status(200).json({
            success: true,
            message: "Category select options fetched successfully",
            data: categories,
        });
    },

    async update(req: Request<{ id: string }, object, UpdateCategoryRequestDto>, res: Response) {
        const category = await categoryService.update(getIdParam(req), req.body);

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category,
        });
    },

    async delete(req: Request, res: Response) {
        const category = await categoryService.delete(getIdParam(req));

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            data: category,
        });
    },
};
