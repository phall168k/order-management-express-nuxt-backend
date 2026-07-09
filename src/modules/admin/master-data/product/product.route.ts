import { Router } from "express";
import { authMiddleware } from "../../../../common/middlewares/auth.middleware";
import { permissionMiddleware } from "../../../../common/middlewares/permission.middleware";
import { productController } from "./product.controller";
import {
    validateCreateProduct,
    validateUpdateProduct,
} from "./product.validation";

const router = Router();

/**
 * @swagger
 * /master-data/products:
 *   get:
 *     summary: Get products with pagination
 *     tags: [Products]
 *     security: []
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
 *         description: Products fetched successfully
 */
router.get("/", productController.findAll);

/**
 * @swagger
 * /master-data/products/select-options:
 *   get:
 *     summary: Get product select options
 *     tags: [Products]
 *     security: []
 *     responses:
 *       200:
 *         description: Product select options fetched successfully
 */
router.get(
    "/select-options",
    productController.findSelectOptions,
);

/**
 * @swagger
 * /master-data/products/{id}:
 *   get:
 *     summary: Get a product by id
 *     tags: [Products]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product fetched successfully
 *       404:
 *         description: Product not found
 */
router.get("/:id", productController.findById);

router.use(authMiddleware);

/**
 * @swagger
 * /master-data/products:
 *   post:
 *     summary: Create a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductRequest'
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post("/", permissionMiddleware("product.create"), validateCreateProduct, productController.create);

/**
 * @swagger
 * /master-data/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
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
 *             $ref: '#/components/schemas/UpdateProductRequest'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:router
    .route("/:id")
    .put(permissionMiddleware("product.update"), validateUpdateProduct, productController.update)
    .delete(permissionMiddleware("product.delete"), productController.delete);

export default router;

 *       200:
 *         description: Product deleted successfully
 */
router
    .route("/:id")
    .put(permissionMiddleware("product.update"), validateUpdateProduct, productController.update)
    .delete(permissionMiddleware("product.delete"), productController.delete);

export default router;
