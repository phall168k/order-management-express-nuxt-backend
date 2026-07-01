import { Router } from "express";
import { authMiddleware } from "../../../../common/middlewares/auth.middleware";
import { permissionMiddleware } from "../../../../common/middlewares/permission.middleware";
import { paymentMethodController } from "./payment-method.controller";
import {
    validateCreatePaymentMethod,
    validateUpdatePaymentMethod,
} from "./payment-method.validation";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /system/payment-methods:
 *   get:
 *     summary: Get payment methods with pagination
 *     tags: [Payment Methods]
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
 *         description: Payment methods fetched successfully
 *   post:
 *     summary: Create payment method
 *     tags: [Payment Methods]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePaymentMethodRequest'
 *     responses:
 *       201:
 *         description: Payment method created successfully
 */
router
    .route("/")
    .get(permissionMiddleware("payment-method.read"), paymentMethodController.findAll)
    .post(
        permissionMiddleware("payment-method.create"),
        validateCreatePaymentMethod,
        paymentMethodController.create,
    );

/**
 * @swagger
 * /system/payment-methods/select-options:
 *   get:
 *     summary: Get payment method select options
 *     tags: [Payment Methods]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment method select options fetched successfully
 */
router.get(
    "/select-options",
    paymentMethodController.findSelectOptions,
);

/**
 * @swagger
 * /system/payment-methods/{id}:
 *   get:
 *     summary: Get payment method by id
 *     tags: [Payment Methods]
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
 *         description: Payment method fetched successfully
 *       404:
 *         description: Payment method not found
 *   put:
 *     summary: Update payment method
 *     tags: [Payment Methods]
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
 *             $ref: '#/components/schemas/UpdatePaymentMethodRequest'
 *     responses:
 *       200:
 *         description: Payment method updated successfully
 *   delete:
 *     summary: Delete payment method
 *     tags: [Payment Methods]
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
 *         description: Payment method deleted successfully
 */
router
    .route("/:id")
    .get(permissionMiddleware("payment-method.read"), paymentMethodController.findById)
    .put(
        permissionMiddleware("payment-method.update"),
        validateUpdatePaymentMethod,
        paymentMethodController.update,
    )
    .delete(permissionMiddleware("payment-method.delete"), paymentMethodController.delete);

export default router;
