import { Router } from "express";
import { authMiddleware } from "../../../../common/middlewares/auth.middleware";
import { permissionMiddleware } from "../../../../common/middlewares/permission.middleware";
import { stockAdjustmentController } from "./stock-adjustment.controller";
import {
    validateCreateStockAdjustment,
    validateUpdateStockAdjustment,
} from "./stock-adjustment.validation";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /inventory/stock-adjustments:
 *   get:
 *     summary: Get stock adjustments with pagination
 *     tags: [Stock Adjustments]
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
 *         description: Stock adjustments fetched successfully
 *   post:
 *     summary: Create stock adjustment
 *     tags: [Stock Adjustments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStockAdjustmentRequest'
 *     responses:
 *       201:
 *         description: Stock adjustment created successfully
 */
router
    .route("/")
    .get(permissionMiddleware("stock-adjustment.read"), stockAdjustmentController.findAll)
    .post(
        permissionMiddleware("stock-adjustment.create"),
        validateCreateStockAdjustment,
        stockAdjustmentController.create,
    );

/**
 * @swagger
 * /inventory/stock-adjustments/{id}:
 *   get:
 *     summary: Get stock adjustment by id
 *     tags: [Stock Adjustments]
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
 *         description: Stock adjustment fetched successfully
 *       404:
 *         description: Stock adjustment not found
 *   put:
 *     summary: Update stock adjustment
 *     tags: [Stock Adjustments]
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
 *             $ref: '#/components/schemas/UpdateStockAdjustmentRequest'
 *     responses:
 *       200:
 *         description: Stock adjustment updated successfully
 *   delete:
 *     summary: Delete stock adjustment
 *     tags: [Stock Adjustments]
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
 *         description: Stock adjustment deleted successfully
 */
router
    .route("/:id")
    .get(permissionMiddleware("stock-adjustment.read"), stockAdjustmentController.findById)
    .put(
        permissionMiddleware("stock-adjustment.update"),
        validateUpdateStockAdjustment,
        stockAdjustmentController.update,
    )
    .delete(permissionMiddleware("stock-adjustment.delete"), stockAdjustmentController.delete);

export default router;
