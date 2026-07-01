import { Router } from "express";
import { authMiddleware } from "../../../../common/middlewares/auth.middleware";
import { permissionMiddleware } from "../../../../common/middlewares/permission.middleware";
import { stockController } from "./stock.controller";
import {
    validateCreateStock,
    validateUpdateStock,
} from "./stock.validation";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /inventory/stocks:
 *   get:
 *     summary: Get stocks with pagination
 *     tags: [Stocks]
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
 *         description: Stocks fetched successfully
 *   post:
 *     summary: Create stock
 *     tags: [Stocks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStockRequest'
 *     responses:
 *       201:
 *         description: Stock created successfully
 */
router
    .route("/")
    .get(permissionMiddleware("stock.read"), stockController.findAll)
    .post(permissionMiddleware("stock.create"), validateCreateStock, stockController.create);

/**
 * @swagger
 * /inventory/stocks/{id}:
 *   get:
 *     summary: Get stock by id
 *     tags: [Stocks]
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
 *         description: Stock fetched successfully
 *       404:
 *         description: Stock not found
 *   put:
 *     summary: Update stock
 *     tags: [Stocks]
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
 *             $ref: '#/components/schemas/UpdateStockRequest'
 *     responses:
 *       200:
 *         description: Stock updated successfully
 *   delete:
 *     summary: Delete stock
 *     tags: [Stocks]
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
 *         description: Stock deleted successfully
 */
router
    .route("/:id")
    .get(permissionMiddleware("stock.read"), stockController.findById)
    .put(permissionMiddleware("stock.update"), validateUpdateStock, stockController.update)
    .delete(permissionMiddleware("stock.delete"), stockController.delete);

export default router;
