import { Router } from "express";
import { authMiddleware } from "../../../../common/middlewares/auth.middleware";
import { permissionMiddleware } from "../../../../common/middlewares/permission.middleware";
import { notificationTypeController } from "./notification-type.controller";
import { validateCreateNotificationType, validateUpdateNotificationType } from "./notification-type.validation";

const router = Router();
router.use(authMiddleware);

/**
 * @swagger
 * /system/notification-types:
 *   get:
 *     summary: Get notification types with pagination
 *     tags: [Notification Types]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 10 } }
 *       - { in: query, name: search, schema: { type: string } }
 *     responses:
 *       200: { description: Notification types fetched successfully }
 *   post:
 *     summary: Create notification type
 *     tags: [Notification Types]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateNotificationTypeRequest' }
 *     responses:
 *       201: { description: Notification type created successfully }
 */
router.route("/")
    .get(permissionMiddleware("notification-type.read"), notificationTypeController.findAll)
    .post(permissionMiddleware("notification-type.create"), validateCreateNotificationType, notificationTypeController.create);

router.get("/select-options", notificationTypeController.findSelectOptions);

/**
 * @swagger
 * /system/notification-types/{id}:
 *   get:
 *     summary: Get notification type by id
 *     tags: [Notification Types]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Notification type fetched successfully }
 *       404: { description: Notification type not found }
 *   put:
 *     summary: Update notification type
 *     tags: [Notification Types]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateNotificationTypeRequest' }
 *     responses:
 *       200: { description: Notification type updated successfully }
 *   delete:
 *     summary: Delete notification type
 *     tags: [Notification Types]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Notification type deleted successfully }
 */
router.route("/:id")
    .get(permissionMiddleware("notification-type.read"), notificationTypeController.findById)
    .put(permissionMiddleware("notification-type.update"), validateUpdateNotificationType, notificationTypeController.update)
    .delete(permissionMiddleware("notification-type.delete"), notificationTypeController.delete);

export default router;
