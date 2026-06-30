import { Client, BucketItem, BucketItemStat } from "minio";
import path from "path";
import { randomUUID } from "crypto";
import { HttpException } from "../common/exceptions/http.exception";

export type UploadedMinioObject = {
    bucket: string;
    objectName: string;
    originalName: string;
    mimeType: string;
    size: number;
    etag: string;
    url: string;
};

export type UploadFilePayload = {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
};

const parseBoolean = (value: string | undefined, defaultValue: boolean) => {
    if (value === undefined) {
        return defaultValue;
    }

    return value === "true";
};

const parseNumber = (value: string | undefined, defaultValue: number) => {
    if (!value) {
        return defaultValue;
    }

    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : defaultValue;
};

const minioConfig = {
    endPoint: process.env.MINIO_ENDPOINT || "localhost",
    port: parseNumber(process.env.MINIO_PORT, 9000),
    useSSL: parseBoolean(process.env.MINIO_USE_SSL, false),
    accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
    secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
    bucket: process.env.MINIO_BUCKET || "order-management",
    region: process.env.MINIO_REGION || "us-east-1",
};

const minioClient = new Client({
    endPoint: minioConfig.endPoint,
    port: minioConfig.port,
    useSSL: minioConfig.useSSL,
    accessKey: minioConfig.accessKey,
    secretKey: minioConfig.secretKey,
});

const normalizePrefix = (prefix?: string) => {
    if (!prefix) {
        return "";
    }

    return prefix
        .trim()
        .replace(/^\/+/, "")
        .replace(/\/+$/, "");
};

const normalizeObjectName = (objectName: string) => {
    const normalized = objectName.trim().replace(/^\/+/, "");

    if (!normalized || normalized.includes("..")) {
        throw new HttpException(400, "Invalid object name");
    }

    return normalized;
};

const buildObjectName = (originalName: string, objectName?: string, prefix?: string) => {
    if (objectName) {
        return normalizeObjectName(objectName);
    }

    const safePrefix = normalizePrefix(prefix);
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension).replace(/[^a-zA-Z0-9-_]/g, "-");
    const generatedName = `${Date.now()}-${randomUUID()}-${baseName}${extension}`;

    return safePrefix ? `${safePrefix}/${generatedName}` : generatedName;
};

const ensureBucket = async () => {
    const exists = await minioClient.bucketExists(minioConfig.bucket);

    if (!exists) {
        await minioClient.makeBucket(minioConfig.bucket, minioConfig.region);
    }
};

const getPublicUrl = (objectName: string) => {
    const protocol = minioConfig.useSSL ? "https" : "http";

    return `${protocol}://${minioConfig.endPoint}:${minioConfig.port}/${minioConfig.bucket}/${objectName}`;
};

export const minioService = {
    async upload(file: UploadFilePayload, objectName?: string, prefix?: string): Promise<UploadedMinioObject> {
        if (!file) {
            throw new HttpException(400, "File is required");
        }

        await ensureBucket();

        const finalObjectName = buildObjectName(file.originalname, objectName, prefix);
        const result = await minioClient.putObject(
            minioConfig.bucket,
            finalObjectName,
            file.buffer,
            file.size,
            {
                "Content-Type": file.mimetype,
                "Original-Name": file.originalname,
            },
        );

        return {
            bucket: minioConfig.bucket,
            objectName: finalObjectName,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            etag: result.etag,
            url: getPublicUrl(finalObjectName),
        };
    },

    async list(prefix?: string, recursive = true): Promise<BucketItem[]> {
        await ensureBucket();

        return new Promise((resolve, reject) => {
            const objects: BucketItem[] = [];
            const stream = minioClient.listObjectsV2(
                minioConfig.bucket,
                normalizePrefix(prefix),
                recursive,
            );

            stream.on("data", (object) => objects.push(object));
            stream.on("error", reject);
            stream.on("end", () => resolve(objects));
        });
    },

    async stat(objectName: string): Promise<BucketItemStat> {
        await ensureBucket();

        return minioClient.statObject(minioConfig.bucket, normalizeObjectName(objectName));
    },

    async getObject(objectName: string) {
        await ensureBucket();

        return minioClient.getObject(minioConfig.bucket, normalizeObjectName(objectName));
    },

    async remove(objectName: string) {
        await ensureBucket();

        await minioClient.removeObject(minioConfig.bucket, normalizeObjectName(objectName));

        return {
            bucket: minioConfig.bucket,
            objectName: normalizeObjectName(objectName),
        };
    },

    async presignedGetObject(objectName: string, expiresInSeconds = 60 * 60) {
        await ensureBucket();

        return minioClient.presignedGetObject(
            minioConfig.bucket,
            normalizeObjectName(objectName),
            expiresInSeconds,
        );
    },

    async presignedPutObject(objectName: string, expiresInSeconds = 60 * 60) {
        await ensureBucket();

        return minioClient.presignedPutObject(
            minioConfig.bucket,
            normalizeObjectName(objectName),
            expiresInSeconds,
        );
    },
};
