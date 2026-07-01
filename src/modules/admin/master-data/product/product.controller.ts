import { Request, Response } from "express";
import { HttpException } from "../../../../common/exceptions/http.exception";
import { PaginationQueryDto } from "../../../../common/services/base-pagination.service";
import { CreateProductRequestDto } from "./dto/create-product-request.dto";
import { UpdateProductRequestDto } from "./dto/update-product-request.dto";
import { productService } from "./product.service";

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

export const productController = {
    async create(req: Request<object, object, CreateProductRequestDto>, res: Response) {
        const product = await productService.create(req.body, getAuthUserId(req.user?._id));

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product,
        });
    },

    async findAll(req: Request<object, object, object, PaginationQueryDto>, res: Response) {
        const products = await productService.findAll(req.query);

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            ...products,
        });
    },

    async findById(req: Request, res: Response) {
        const product = await productService.findById(getIdParam(req));

        return res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: product,
        });
    },

    async findSelectOptions(_req: Request, res: Response) {
        const products = await productService.findSelectOptions();

        return res.status(200).json({
            success: true,
            message: "Product select options fetched successfully",
            data: products,
        });
    },

    async update(req: Request<{ id: string }, object, UpdateProductRequestDto>, res: Response) {
        const product = await productService.update(getIdParam(req), req.body);

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product,
        });
    },

    async delete(req: Request, res: Response) {
        const product = await productService.delete(getIdParam(req));

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: product,
        });
    },
};
