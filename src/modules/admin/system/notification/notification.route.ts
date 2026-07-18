import { Router } from "express";
import { authMiddleware } from "../../../../common/middlewares/auth.middleware";
import { permissionMiddleware } from "../../../../common/middlewares/permission.middleware";
import { notificationController } from "./notification.controller";
import { validateCreateNotification, validateUpdateNotification } from "./notification.validation";

const router = Router();
router.use(authMiddleware);

/**
 * @swagger
 * /system/notifications:
 *   get:
 *     summary: Get all notifications with pagination
 *     tags: [Notifications]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Notifications fetched successfully }
 *   post:
 *     summary: Create notification (no permission required)
 *     tags: [Notifications]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateNotificationRequest' }
 *     responses:
 *       201: { description: Notification created successfully }
 */
router.route("/")
    .get(permissionMiddleware("notification.read"), notificationController.findAll)
    .post(validateCreateNotification, notificationController.create);

/**
 * @swagger
 * /system/notifications/received:
 *   get:
 *     summary: Get notifications received by the authenticated user
 *     tags: [Notifications]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Received notifications fetched successfully }
 */
router.get("/received", notificationController.findReceived);

/**
 * @swagger
 * /system/notifications/{id}:
 *   get:
 *     summary: Get notification by id (no permission required)
 *     tags: [Notifications]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Notification fetched successfully }
 *   put:
 *     summary: Update notification
 *     tags: [Notifications]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateNotificationRequest' }
 *     responses:
 *       200: { description: Notification updated successfully }
 *   delete:
 *     summary: Delete notification
 *     tags: [Notifications]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Notification deleted successfully }
 */
router.route("/:id")
    .get(notificationController.findById)
    .put(permissionMiddleware("notification.update"), validateUpdateNotification, notificationController.update)
    .delete(permissionMiddleware("notification.delete"), notificationController.delete);

export default router;
