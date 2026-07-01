import { Router } from "express";
import { authMiddleware } from "../../../../common/middlewares/auth.middleware";
import { permissionMiddleware } from "../../../../common/middlewares/permission.middleware";
import { stockInController } from "./stock-in.controller";
import {
    validateCreateStockIn,
    validateUpdateStockIn,
} from "./stock-in.validation";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /inventory/stock-ins:
 *   get:
 *     summary: Get stock in with pagination
 *     tags: [Stock In]
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
 *         description: Stock in fetched successfully
 *   post:
 *     summary: Create stock in
 *     tags: [Stock In]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStockInRequest'
 *     responses:
 *       201:
 *         description: Stock in created successfully
 */
router
    .route("/")
    .get(permissionMiddleware("stock-in.read"), stockInController.findAll)
    .post(permissionMiddleware("stock-in.create"), validateCreateStockIn, stockInController.create);

/**
 * @swagger
 * /inventory/stock-ins/{id}:
 *   get:
 *     summary: Get stock in by id
 *     tags: [Stock In]
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
 *         description: Stock in fetched successfully
 *       404:
 *         description: Stock in not found
 *   put:
 *     summary: Update stock in
 *     tags: [Stock In]
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
 *             $ref: '#/components/schemas/UpdateStockInRequest'
 *     responses:
 *       200:
 *         description: Stock in updated successfully
 *   delete:
 *     summary: Delete stock in
 *     tags: [Stock In]
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
 *         description: Stock in deleted successfully
 */
router
    .route("/:id")
    .get(permissionMiddleware("stock-in.read"), stockInController.findById)
    .put(permissionMiddleware("stock-in.update"), validateUpdateStockIn, stockInController.update)
    .delete(permissionMiddleware("stock-in.delete"), stockInController.delete);

export default router;
