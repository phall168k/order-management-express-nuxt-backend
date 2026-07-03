import { Router } from "express";
import { authMiddleware } from "../../../../common/middlewares/auth.middleware";
import { permissionMiddleware } from "../../../../common/middlewares/permission.middleware";
import { bannerController } from "./banner.controller";
import {
    validateCreateBanner,
    validateUpdateBanner,
} from "./banner.validation";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /saling/banners:
 *   get:
 *     summary: Get banners with pagination
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Banners fetched successfully
 *   post:
 *     summary: Create banner
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBannerRequest'
 *     responses:
 *       201:
 *         description: Banner created successfully
 */
router
    .route("/")
    .get(permissionMiddleware("banner.read"), bannerController.findAll)
    .post(permissionMiddleware("banner.create"), validateCreateBanner, bannerController.create);

/**
 * @swagger
 * /saling/banners/select-options:
 *   get:
 *     summary: Get banner select options
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Banner select options fetched successfully
 */
router.get(
    "/select-options",
    permissionMiddleware("banner.read"),
    bannerController.findSelectOptions,
);

/**
 * @swagger
 * /saling/banners/{id}:
 *   get:
 *     summary: Get banner by id
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Banner fetched successfully
 *       404:
 *         description: Banner not found
 *   put:
 *     summary: Update banner
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBannerRequest'
 *     responses:
 *       200:
 *         description: Banner updated successfully
 *   delete:
 *     summary: Delete banner
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Banner deleted successfully
 */
router
    .route("/:id")
    .get(permissionMiddleware("banner.read"), bannerController.findById)
    .put(permissionMiddleware("banner.update"), validateUpdateBanner, bannerController.update)
    .delete(permissionMiddleware("banner.delete"), bannerController.delete);

export default router;
