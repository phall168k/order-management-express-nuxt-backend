import { Request, Response } from "express";
import { PaginationQueryDto } from "../../../../common/services/base-pagination.service";
import { CreatePermissionRequestDto } from "./dto/create-permission-request.dto";
import { UpdatePermissionRequestDto } from "./dto/update-permission-request.dto";
import { permissionService } from "./permissoin.service";

const getIdParam = (req: Request) => {
    const id = req.params.id;

    return Array.isArray(id) ? id[0] : id;
};

export const permissionController = {
    async create(req: Request<object, object, CreatePermissionRequestDto>, res: Response) {
        const permission = await permissionService.create(req.body);

        return res.status(201).json({
            success: true,
            message: "Permission created successfully",
            data: permission,
        });
    },

    async findAll(req: Request<object, object, object, PaginationQueryDto>, res: Response) {
        const permissions = await permissionService.findAll(req.query);

        return res.status(200).json({
            success: true,
            message: "Permissions fetched successfully",
            ...permissions,
        });
    },

    async findById(req: Request, res: Response) {
        const permission = await permissionService.findById(getIdParam(req));

        return res.status(200).json({
            success: true,
            message: "Permission fetched successfully",
            data: permission,
        });
    },

    async update(req: Request<{ id: string }, object, UpdatePermissionRequestDto>, res: Response) {
        const permission = await permissionService.update(getIdParam(req), req.body);

        return res.status(200).json({
            success: true,
            message: "Permission updated successfully",
            data: permission,
        });
    },

    async delete(req: Request, res: Response) {
        const permission = await permissionService.delete(getIdParam(req));

        return res.status(200).json({
            success: true,
            message: "Permission deleted successfully",
            data: permission,
        });
    },
};
