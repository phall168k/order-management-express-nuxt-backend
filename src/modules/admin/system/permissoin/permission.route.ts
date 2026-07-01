import { Router } from "express";
import { authMiddleware } from "../../../../common/middlewares/auth.middleware";
import { permissionController } from "./permission.controller";
import {
    validateCreatePermission,
    validateUpdatePermission,
} from "./permission.validition";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /system/permissions:
 *   get:
 *     summary: Get permissions with pagination
 *     tags: [Permissions]
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
 *         description: Permissions fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Permissions fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Permission'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationMeta'
 *   post:
 *     summary: Create a permission
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePermissionRequest'
 *     responses:
 *       201:
 *         description: Permission created successfully
 *       400:
 *         description: Invalid request body
 *       409:
 *         description: Permission already exists
 */
router
    .route("/")
    .get(permissionController.findAll)
    .post(validateCreatePermission, permissionController.create);

/**
 * @swagger
 * /system/permissions/select-options:
 *   get:
 *     summary: Get permission select options
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Permission select options fetched successfully
 */
router.get(
    "/select-options",
    permissionController.findSelectOptions,
);

/**
 * @swagger
 * /system/permissions/{id}:
 *   get:
 *     summary: Get a permission by id
 *     tags: [Permissions]
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
 *         description: Permission fetched successfully
 *       404:
 *         description: Permission not found
 *   put:
 *     summary: Update a permission
 *     tags: [Permissions]
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
 *             $ref: '#/components/schemas/UpdatePermissionRequest'
 *     responses:
 *       200:
 *         description: Permission updated successfully
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Permission not found
 *       409:
 *         description: Permission already exists
 *   delete:
 *     summary: Delete a permission
 *     tags: [Permissions]
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
 *         description: Permission deleted successfully
 *       404:
 *         description: Permission not found
 */
router
    .route("/:id")
    .get(permissionController.findById)
    .put(validateUpdatePermission, permissionController.update)
    .delete(permissionController.delete);

export default router;
