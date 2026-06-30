import { Router } from "express";
import multer from "multer";
import { minioController } from "./minio.controller";

const router = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: Number(process.env.MINIO_MAX_FILE_SIZE_MB || 20) * 1024 * 1024,
    },
});

/**
 * @swagger
 * tags:
 *   - name: MinIO
 *     description: Object storage endpoints
 *
 * /minio/upload:
 *   post:
 *     summary: Upload a file to MinIO
 *     tags: [MinIO]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               objectName:
 *                 type: string
 *                 example: invoices/invoice-001.pdf
 *               prefix:
 *                 type: string
 *                 example: uploads
 *     responses:
 *       201:
 *         description: File uploaded successfully
 */
router.post("/upload", upload.single("file"), minioController.upload);

/**
 * @swagger
 * /minio/objects:
 *   get:
 *     summary: List MinIO objects
 *     tags: [MinIO]
 *     parameters:
 *       - in: query
 *         name: prefix
 *         schema:
 *           type: string
 *       - in: query
 *         name: recursive
 *         schema:
 *           type: boolean
 *           default: true
 *     responses:
 *       200:
 *         description: Objects fetched successfully
 */
router.get("/objects", minioController.list);

/**
 * @swagger
 * /minio/stat:
 *   get:
 *     summary: Get object metadata
 *     tags: [MinIO]
 *     parameters:
 *       - in: query
 *         name: objectName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Object metadata fetched successfully
 */
router.get("/stat", minioController.stat);

/**
 * @swagger
 * /minio/download:
 *   get:
 *     summary: Download an object
 *     tags: [MinIO]
 *     parameters:
 *       - in: query
 *         name: objectName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Object stream
 */
router.get("/download", minioController.download);

/**
 * @swagger
 * /minio:
 *   delete:
 *     summary: Delete an object
 *     tags: [MinIO]
 *     parameters:
 *       - in: query
 *         name: objectName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Object deleted successfully
 */
router.delete("/", minioController.remove);

/**
 * @swagger
 * /minio/presigned-get:
 *   post:
 *     summary: Create a presigned download URL
 *     tags: [MinIO]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [objectName]
 *             properties:
 *               objectName:
 *                 type: string
 *               expiresInSeconds:
 *                 type: integer
 *                 default: 3600
 *     responses:
 *       200:
 *         description: Presigned download URL created successfully
 */
router.post("/presigned-get", minioController.presignedGet);

/**
 * @swagger
 * /minio/presigned-put:
 *   post:
 *     summary: Create a presigned upload URL
 *     tags: [MinIO]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [objectName]
 *             properties:
 *               objectName:
 *                 type: string
 *               expiresInSeconds:
 *                 type: integer
 *                 default: 3600
 *     responses:
 *       200:
 *         description: Presigned upload URL created successfully
 */
router.post("/presigned-put", minioController.presignedPut);

export default router;
