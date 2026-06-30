import { Request, Response } from "express";
import { PaginationQueryDto } from "../../../../common/services/base-pagination.service";
import { CreateRoleRequestDto } from "./dto/create-role-request.dto";
import { UpdateRoleRequestDto } from "./dto/update-role-request.dto";
import { roleService } from "./role.service";

const getIdParam = (req: Request) => {
    const id = req.params.id;

    return Array.isArray(id) ? id[0] : id;
};

export const roleController = {
    async create(req: Request<object, object, CreateRoleRequestDto>, res: Response) {
        const role = await roleService.create(req.body);

        return res.status(201).json({
            success: true,
            message: "Role created successfully",
            data: role,
        });
    },

    async findAll(req: Request<object, object, object, PaginationQueryDto>, res: Response) {
        const roles = await roleService.findAll(req.query);

        return res.status(200).json({
            success: true,
            message: "Roles fetched successfully",
            ...roles,
        });
    },

    async findById(req: Request, res: Response) {
        const role = await roleService.findById(getIdParam(req));

        return res.status(200).json({
            success: true,
            message: "Role fetched successfully",
            data: role,
        });
    },

    async findSelectOptions(_req: Request, res: Response) {
        const roles = await roleService.findSelectOptions();

        return res.status(200).json({
            success: true,
            message: "Role select options fetched successfully",
            data: roles,
        });
    },

    async update(req: Request<{ id: string }, object, UpdateRoleRequestDto>, res: Response) {
        const role = await roleService.update(getIdParam(req), req.body);

        return res.status(200).json({
            success: true,
            message: "Role updated successfully",
            data: role,
        });
    },

    async delete(req: Request, res: Response) {
        const role = await roleService.delete(getIdParam(req));

        return res.status(200).json({
            success: true,
            message: "Role deleted successfully",
            data: role,
        });
    },
};
