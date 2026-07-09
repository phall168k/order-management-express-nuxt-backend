import { Router } from "express";
import { authMiddleware } from "../../../../common/middlewares/auth.middleware";
import { permissionMiddleware } from "../../../../common/middlewares/permission.middleware";
import { categoryController } from "./category.controller";
import {
    validateCreateCategory,
    validateUpdateCategory,
} from "./category.validation";

const router = Router();

/**
 * @swagger
 * /master-data/categories/select-options:
 *   get:
 *     summary: Get category select options
 *     tags: [Categories]
 *     security: []
 *     responses:
 *       200:
 *         description: Category select options fetched successfully
 */
router.get(
    "/select-options",
    categoryController.findSelectOptions,
);

router.use(authMiddleware);

/**
 * @swagger
 * /master-data/categories:
 *   get:
 *     summary: Get categories with pagination
 *     tags: [Categories]
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
 *         description: Categories fetched successfully
 *   post:
 *     summary: Create a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryRequest'
 *     responses:
 *       201:
 *         description: Category created successfully
 */
router
    .route("/")
    .get(permissionMiddleware("category.read"), categoryController.findAll)
    .post(permissionMiddleware("category.create"), validateCreateCategory, categoryController.create);

/**
 * @swagger
 * /master-data/categories/{id}:
 *   get:
 *     summary: Get a category by id
 *     tags: [Categories]
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
 *         description: Category fetched successfully
 *       404:
 *         description: Category not found
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
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
 *             $ref: '#/components/schemas/UpdateCategoryRequest'
 *     responses:
 *       200:
 *         description: Category updated successfully
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
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
 *         description: Category deleted successfully
 */
router
    .route("/:id")
    .get(permissionMiddleware("category.read"), categoryController.findById)
    .put(permissionMiddleware("category.update"), validateUpdateCategory, categoryController.update)
    .delete(permissionMiddleware("category.delete"), categoryController.delete);

export default router;
