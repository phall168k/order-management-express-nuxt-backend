import { Request, Response } from "express";
import { PaginationQueryDto } from "../../../../common/services/base-pagination.service";
import { CreateUserRequestDto } from "./dto/create-user-request.dto";
import { UpdateUserRequestDto } from "./dto/update-user-request.dto";
import { userService } from "./user.service";

const getIdParam = (req: Request) => {
    const id = req.params.id;

    return Array.isArray(id) ? id[0] : id;
};

export const userController = {
    async create(req: Request<object, object, CreateUserRequestDto>, res: Response) {
        const user = await userService.create(req.body);

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user,
        });
    },

    async findAll(req: Request<object, object, object, PaginationQueryDto>, res: Response) {
        const users = await userService.findAll(req.query);

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            ...users,
        });
    },

    async findById(req: Request, res: Response) {
        const user = await userService.findById(getIdParam(req));

        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: user,
        });
    },

    async findSelectOptions(req: Request, res: Response) {
        const users = await userService.findSelectOptions();

        return res.status(200).json({
            success: true,
            message: "User select options fetched successfully",
            data: users,
        });
    },

    async update(req: Request<{ id: string }, object, UpdateUserRequestDto>, res: Response) {
        const user = await userService.update(getIdParam(req), req.body);

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user,
        });
    },

    async delete(req: Request, res: Response) {
        const user = await userService.delete(getIdParam(req));

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: user,
        });
    },
};
