import { Router } from "express";
import { authMiddleware } from "../../../../common/middlewares/auth.middleware";
import { permissionMiddleware } from "../../../../common/middlewares/permission.middleware";
import { saleController } from "./sale.controller";
import {
    validateCreateSale,
    validateUpdateSale,
} from "./sale.validation";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /saling/sales:
 *   get:
 *     summary: Get sales with pagination
 *     tags: [Sales]
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
 *         description: Sales fetched successfully
 *   post:
 *     summary: Create sale
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSaleRequest'
 *     responses:
 *       201:
 *         description: Sale created successfully
 */
router
    .route("/")
    .get(permissionMiddleware("sale.read"), saleController.findAll)
    .post(validateCreateSale, saleController.create);

/**
 * @swagger
 * /saling/sales/{id}:
 *   get:
 *     summary: Get sale by id
 *     tags: [Sales]
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
 *         description: Sale fetched successfully
 *       404:
 *         description: Sale not found
 *   put:
 *     summary: Update sale
 *     tags: [Sales]
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
 *             $ref: '#/components/schemas/UpdateSaleRequest'
 *     responses:
 *       200:
 *         description: Sale updated successfully
 *   delete:
 *     summary: Delete sale
 *     tags: [Sales]
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
 *         description: Sale deleted successfully
 */
router
    .route("/:id")
    .get(permissionMiddleware("sale.read"), saleController.findById)
    .put(permissionMiddleware("sale.update"), validateUpdateSale, saleController.update)
    .delete(permissionMiddleware("sale.delete"), saleController.delete);

export default router;
