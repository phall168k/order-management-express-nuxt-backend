import { Router } from "express";
import { authMiddleware } from "../../../../common/middlewares/auth.middleware";
import { orderController } from "./order.controller";
import {
    validateCreateOrder,
    validateUpdateOrder,
} from "./order.validation";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /saling/orders:
 *   get:
 *     summary: Get products picked by current user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Picked products fetched successfully
 *   post:
 *     summary: Pick a product
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product
 *               - quantity
 *             properties:
 *               product:
 *                 type: string
 *                 example: 64f0f0f0f0f0f0f0f0f0f0f0
 *               quantity:
 *                 type: number
 *                 minimum: 1
 *                 example: 1
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router
    .route("/")
    .get(orderController.findMyProducts)
    .post(validateCreateOrder, orderController.create);

/**
 * @swagger
 * /saling/orders/my-products:
 *   get:
 *     summary: Get products picked by current user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Picked products fetched successfully
 */
router.get("/my-products", orderController.findMyProducts);

/**
 * @swagger
 * /saling/orders/{id}:
 *   get:
 *     summary: Get current user's order by id
 *     tags: [Orders]
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
 *         description: Order fetched successfully
 *       404:
 *         description: Order not found
 *   put:
 *     summary: Update current user's picked product
 *     tags: [Orders]
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
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *                 example: 64f0f0f0f0f0f0f0f0f0f0f0
 *               quantity:
 *                 type: number
 *                 minimum: 1
 *                 example: 2
 *     responses:
 *       200:
 *         description: Order updated successfully
 *   delete:
 *     summary: Delete current user's picked product
 *     tags: [Orders]
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
 *         description: Order deleted successfully
 */
router
    .route("/:id")
    .get(orderController.findById)
    .put(validateUpdateOrder, orderController.update)
    .delete(orderController.delete);

export default router;
