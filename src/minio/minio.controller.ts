import { Request, Response } from "express";
import { HttpException } from "../common/exceptions/http.exception";
import { minioService } from "./minio.service";

type UploadBody = {
    objectName?: string;
    prefix?: string;
};

type ObjectNameQuery = {
    objectName?: string;
};

type ListQuery = {
    prefix?: string;
    recursive?: string;
};

type PresignedBody = {
    objectName?: string;
    expiresInSeconds?: number;
};

const DEFAULT_EXPIRES_IN_SECONDS = 10000;

const getRequiredObjectName = (value?: string) => {
    if (!value) {
        throw new HttpException(400, "Object name is required");
    }

    return value;
};

const getExpiresInSeconds = (value?: number) => {
    if (value === undefined) {
        return DEFAULT_EXPIRES_IN_SECONDS;
    }

    if (!Number.isInteger(value) || value < 1 || value > 7 * 24 * 60 * 60) {
        throw new HttpException(400, "Invalid expiresInSeconds");
    }

    return value;
};

export const minioController = {
    async upload(req: Request<object, object, UploadBody>, res: Response) {
        const file = req.file;

        if (!file) {
            throw new HttpException(400, "File is required");
        }

        const uploadedFile = await minioService.upload(
            file,
            req.body.objectName,
            req.body.prefix,
        );

        return res.status(201).json({
            success: true,
            message: "File uploaded successfully",
            data: uploadedFile,
        });
    },

    async list(req: Request<object, object, object, ListQuery>, res: Response) {
        const objects = await minioService.list(
            req.query.prefix,
            req.query.recursive !== "false",
        );

        return res.status(200).json({
            success: true,
            message: "Objects fetched successfully",
            data: objects,
        });
    },

    async stat(req: Request<object, object, object, ObjectNameQuery>, res: Response) {
        const object = await minioService.stat(getRequiredObjectName(req.query.objectName));

        return res.status(200).json({
            success: true,
            message: "Object metadata fetched successfully",
            data: object,
        });
    },

    async download(req: Request<object, object, object, ObjectNameQuery>, res: Response) {
        const objectName = getRequiredObjectName(req.query.objectName);
        const [object, stream] = await Promise.all([
            minioService.stat(objectName),
            minioService.getObject(objectName),
        ]);

        res.setHeader("Content-Type", object.metaData["content-type"] || "application/octet-stream");
        res.setHeader("Content-Length", object.size);
        res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(objectName.split("/").pop() || "download")}"`);

        return stream.pipe(res);
    },

    async remove(req: Request<object, object, object, ObjectNameQuery>, res: Response) {
        const deletedObject = await minioService.remove(getRequiredObjectName(req.query.objectName));

        return res.status(200).json({
            success: true,
            message: "Object deleted successfully",
            data: deletedObject,
        });
    },

    async presignedGet(req: Request<object, object, PresignedBody>, res: Response) {
        const expiresInSeconds = getExpiresInSeconds(req.body.expiresInSeconds);
        const url = await minioService.presignedGetObject(
            getRequiredObjectName(req.body.objectName),
            expiresInSeconds,
        );

        return res.status(200).json({
            success: true,
            message: "Presigned download URL created successfully",
            data: { url, expiresInSeconds },
        });
    },

    async presignedPut(req: Request<object, object, PresignedBody>, res: Response) {
        const expiresInSeconds = getExpiresInSeconds(req.body.expiresInSeconds);
        const url = await minioService.presignedPutObject(
            getRequiredObjectName(req.body.objectName),
            expiresInSeconds,
        );

        return res.status(200).json({
            success: true,
            message: "Presigned upload URL created successfully",
            data: { url, expiresInSeconds },
        });
    },
};
